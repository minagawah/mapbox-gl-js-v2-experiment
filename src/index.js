/* @prettier */

/* eslint camelcase: [0] */

/**
 * Notice how each function composes other functions. Each function receives an object,
 * and returns the same object to another, making the whole app one big functional chain.
 */

import { compose, tap } from 'ramda';
import mapboxgl from 'mapbox-gl';

import { int, lerp, ease_in_out_quad } from '@/math';
import { DEFAULT_PLACE_KEY, DEFAULT_SKY, PLACES } from '@/constants';

import './styles.css';

// API token is included in the bundle, but has domain name restriction.
mapboxgl.accessToken = MAPBOX_API_TOKEN;

let map;
let anim_req;
let anim_index = 0;
let anim_time = 0;
let prev = 0;

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
      const { id, type, layout = {} } = _layers[i] || {};
      if (type === 'symbol' && layout['text-field']) {
        label_id = id;
        break;
      }
    }

    console.log(`[index] ADD::LAYER: ${blg_opt.id}`);
    map.addLayer(blg_opt, label_id);
  }

  return { key };
};

const set_layers = compose(set_buildings, set_terrain, set_sky);

const onload_maker = key => () => set_layers({ key });

const update_camera = ({ position, altitude, target }) => {
  const camera = map.getFreeCameraOptions();
  camera.position = mapboxgl.MercatorCoordinate.fromLngLat(position, altitude);
  camera.lookAtPoint(target);
  map.setFreeCameraOptions(camera);
};

const tick_maker = curr => time => {
  if (!map) return;

  const { start, end, target, altitude, duration } = curr;

  if (anim_time < duration) {
    const phase = anim_time / duration;
    update_camera({
      position: lerp(ease_in_out_quad(phase), start, end),
      altitude: lerp(phase, altitude[0], altitude[1]),
      target,
    });
  }

  // "delta" is too huge when "prev" is not present.
  const delta = prev ? time - prev : 16;
  anim_time += delta;
  prev = time;

  anim_req = window.requestAnimationFrame(tick_maker(curr));
};

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
        // Update the current animation in case
        // we have a new "anim_index" now.
        curr = animations[anim_index];
        anim_req = window.requestAnimationFrame(tick_maker(curr));
      }
    }
  };
};

/**
 * IMPORTANT:
 * Since this function contains asynchronous tasks,
 * unlike other functions, it does not return
 * the given data back to the functional chain.
 * Make sure that no other functions follow
 * after this function.
 */
const reset_map = ({ key }) => {
  // Make sure to destroy the previous map.
  if (map) {
    map.remove();
    map = null;
  }

  // Cancel animations if running.
  if (anim_req) {
    window.cancelAnimationFrame(anim_req);
    anim_req = null;
  }

  // It takes time to destroy the previous map.
  // If we did not wait, we would end up applying
  // attributes to the previous map.
  setTimeout(() => {
    map = new mapboxgl.Map(PLACES[key].__map.options);
    map.addControl(new mapboxgl.NavigationControl());

    // Reset all the shared variables.
    anim_index = 0;
    anim_time = 0;
    prev = 0;

    map.on('load', onload_maker(key));

    // Add "idle" event handler only when
    // we have animations for the map.
    if (PLACES[key].__map.animations) {
      map.on('idle', onidle_maker(key));
    }
  }, 800);
};

const reset = compose(reset_map, set_title);

const onclick_maker = data => () => reset(data);

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

const init = compose(reset, set_listeners);

// Let's begin!
init({ key: DEFAULT_PLACE_KEY });

// HMR
if (typeof module.hot !== 'undefined') {
  module.hot.accept();
}
