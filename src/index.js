import { compose, tap } from 'ramda';
import mapboxgl from 'mapbox-gl';

import { int, lerp, easeInOutQuad } from '@/math';
import { DEFAULT_PLACE_KEY, DEFAULT_SKY, PLACES } from '@/constants';

import './styles.css';

// API token is included in the bundle, but has domain name restriction.
mapboxgl.accessToken = process.env.MAPBOX_API_TOKEN;

let map;
let anim_req;
let anim_index = 0;
let anim_time = 0;
let prev = 0;
let cnt = 0;

const set_title = ({ key }) => {
  const title = PLACES[key].__map.title;
  const el = document.querySelector('#title');
  if (el && title) {
    el.innerHTML = title;
  }
  return { key };
};

const set_sky = ({ key }) => {
  console.log('[index] ADD::LAYER: sky');
  map.addLayer(DEFAULT_SKY);
  return { key };
};

const set_terrain = ({ key }) => {
  let {
    __source_id: src_id,
    __source_options: src_opt,
    __terrain_options: ter_opt,
  } = PLACES[key].__terrain;

  console.log(`[index] ADD::SOURCE: ${src_id}`);
  map.addSource(src_id, src_opt);
  map.setTerrain(ter_opt);

  return { key };
};

const set_buildings = ({ key }) => {
  const blg_opt = PLACES[key].__building;

  if (blg_opt?.id) {
    const _layers = map.getStyle().layers;

    let label_id;
    for (let i = 0; i < _layers.length; i++) {
      const { id: _id, type: _type, layout = {} } = _layers[i] || {};
      if (_type === 'symbol' && layout['text-field']) {
        label_id = _id;
        break;
      }
    }

    console.log(`[index] ADD::LAYER: ${blg_opt.id}`);
    map.addLayer(blg_opt, label_id);
  }

  return { key };
};

/**
 * @param {Object} [o]
 * @param {string} [o.key]
 * @returns {Object}
 */
const set_layers = compose(set_buildings, set_terrain, set_sky);

/**
 * Returns a handler for "load" event.
 * @returns {Function}
 */
const onload_maker = key => () => set_layers({ key });

const update_camera = ({ position, altitude, target }) => {
  const camera = map.getFreeCameraOptions();
  camera.position = mapboxgl.MercatorCoordinate.fromLngLat(position, altitude);
  camera.lookAtPoint(target);
  map.setFreeCameraOptions(camera);
};

/**
 * @returns {Function}
 */
const tick_maker = curr => time => {
  if (!map) return;

  const { start, end, target, altitude, duration } = curr;

  if (anim_time < duration) {
    const phase = anim_time / duration;

    update_camera({
      position: lerp(easeInOutQuad(phase), start, end),
      altitude: lerp(phase, altitude[0], altitude[1]),
      target,
    });
  }

  // "delta" is too huge when "prev" is not present.
  const delta = prev ? time - prev : 16;
  anim_time += delta;
  prev = time;

  anim_req = window.requestAnimationFrame(tick_maker(curr));

  cnt++;
};

/**
 * Returns a handler for "idle" event.
 * @returns {Function}
 */
const onidle_maker = key => {
  const animations = PLACES[key].__map.animations;

  return () => {
    if (map) {
      let curr = animations[anim_index];

      if (anim_time > curr.duration) {
        // Finish the previous animation.
        window.cancelAnimationFrame(anim_req);
        anim_req = null;
        // Go to the next animation.
        anim_index++;
        anim_index %= animations.length;
        anim_time = 0.8;
      }

      // For "idle" event is called many times, we want
      // to prevent unnecessary animations to be registered.
      if (!anim_req) {
        curr = animations[anim_index];
        anim_req = window.requestAnimationFrame(tick_maker(curr));
      }
    }
  };
};

/**
 * IMPORTANT:
 * Since this function contains asynchronous tasks,
 * unlike other functions, it does not pass along
 * the given data back to the functional chain.
 * Make sure that no other functions would follow
 * after this function.
 */
const reset_map = ({ key }) => {
  // Make sure to destroy the previous app.
  if (map) {
    map.remove();
    map = null;
  }

  if (anim_req) {
    window.cancelAnimationFrame(anim_req);
    anim_req = null;
  }

  // It takes time to destroy the previous app.
  // If we did not wait for a while, we would end up
  // applying the map attributes NOT to the new map,
  // but to the previous map which we want to avoid.
  setTimeout(() => {
    map = new mapboxgl.Map(PLACES[key].__map.options);
    map.addControl(new mapboxgl.NavigationControl());

    anim_index = 0;
    anim_time = 0;
    prev = 0;
    cnt = 0;

    map.on('load', onload_maker(key));

    if (PLACES[key].__map.animations) {
      map.on('idle', onidle_maker(key));
    }
  }, 800);
};

const reset = compose(
  reset_map,
  set_title,
  tap(({ key }) => {
    console.log('[index] RESET RESET RESET');
    console.log(`[index] key: ${key}`);
  })
);

/**
 * Returns a handler for "click" event (for radio inputs).
 * @returns {Function}
 */
const onclick_maker = data => () => reset(data);

/**
 * Sets listers to all the radio inputs.
 */
const set_listeners = data => {
  const { key } = data;
  document.querySelectorAll('input[name="choice"]').forEach(item => {
    const id = item.getAttribute('id');
    const attached_key = id.split('-')[1];

    if (attached_key === key) {
      item.checked = true;
    }

    item.addEventListener('click', onclick_maker({ key: attached_key }));
  });
  return data;
};

/**
 * Notice "set_listeners" is called only at initial startup.
 */
const init = compose(reset, set_listeners);

init({ key: DEFAULT_PLACE_KEY });

// For HMR
if (typeof module.hot !== 'undefined') {
  module.hot.accept();
}
