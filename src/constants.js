/* @prettier */

export const DEFAULT_PLACE_KEY = 'enoshima';

const DEFAULT_MAP = {
  container: 'map',
  // style: 'mapbox://styles/mapbox/light-v10',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [139.6503, 35.6762], // [lng, lat] for Tokyo
  zoom: 18,
  pitch: 45,
  bearing: 20,
  antialias: true,
};

export const DEFAULT_SKY = {
  id: 'sky',
  type: 'sky',
  paint: {
    'sky-type': 'atmosphere',
    'sky-atmosphere-sun': [252, -23], // azimuth, polar
    'sky-atmosphere-sun-intensity': 5, // 15
  },
};

const DEFAULT_TERRAIN = {
  __source_id: 'raster-dem-mapbox',
  __source_options: {
    type: 'raster-dem',
    url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
    tileSize: 512,
  },
  __terrain_options: {
    source: 'raster-dem-mapbox',
    exaggeration: 1.5,
  },
};

const DEFAULT_BUILDING = {
  id: '3d-buildings',
  source: 'composite',
  'source-layer': 'building',
  filter: ['==', 'extrude', 'true'],
  type: 'fill-extrusion',
  minzoom: 15,
  paint: {
    'fill-extrusion-color': '#aaa',
    // Use an 'interpolate' expression to add
    // a smooth transition effect to
    // the buildings as the user zooms in.
    'fill-extrusion-height': [
      'interpolate',
      ['linear'],
      ['zoom'],
      15,
      0,
      15.05,
      ['get', 'height'],
    ],
    'fill-extrusion-base': [
      'interpolate',
      ['linear'],
      ['zoom'],
      15,
      0,
      15.05,
      ['get', 'min_height'],
    ],
    'fill-extrusion-opacity': 0.6,
  },
};

export const PLACES = {
  enoshima: (() => {
    const start = [139.30041, 35.49736];
    const end = [139.48906, 35.30532];
    const target = [139.4834, 35.3005];
    const alt_start = 5000;
    const alt_end = 250;

    return {
      __map: {
        title: 'Enoshima',
        options: {
          ...DEFAULT_MAP,
          style: 'mapbox://styles/mapbox/satellite-v9',
          center: target,
          zoom: 11,
          pitch: 0,
        },
        animations: [
          {
            start: start,
            end: end,
            target: target,
            altitude: [alt_start, alt_end],
            duration: 5000,
          },
          {
            start: end,
            end: end,
            target: target,
            altitude: [alt_end, alt_end],
            duration: 3000,
          },
          {
            start: end,
            end: start,
            target: target,
            altitude: [alt_end, alt_start],
            duration: 3000,
          },
        ],
      },
      __terrain: DEFAULT_TERRAIN,
    };
  })(),
  fuji: {
    __map: {
      title: 'Mt. Fuji',
      options: {
        ...DEFAULT_MAP,
        style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y', // 3D terrain
        center: [138.73021, 35.36279],
        zoom: 11.8,
        pitch: 85,
        bearing: 190,
      },
    },
    __terrain: {
      __source_id: 'raster-dem-RGB',
      __source_options: {
        type: 'raster-dem',
        url: 'mapbox://mapbox.terrain-rgb',
      },
      __terrain_options: {
        source: 'raster-dem-RGB',
        exaggeration: 1.5,
      },
    },
  },
  nezu: {
    __map: {
      title: 'Nezu Shrine',
      options: {
        ...DEFAULT_MAP,
        center: [139.76079, 35.72026],
        zoom: 17,
        pitch: 70,
        bearing: 0,
      },
    },
    __terrain: DEFAULT_TERRAIN,
    __building: DEFAULT_BUILDING,
  },
  masonic: {
    __map: {
      title: 'Tokyo Masonic Center',
      options: {
        ...DEFAULT_MAP,
        center: [139.74414, 35.65977],
        zoom: 17.9,
        pitch: 75,
        bearing: 50,
      },
    },
    __terrain: DEFAULT_TERRAIN,
    __building: DEFAULT_BUILDING,
  },
  shibuya: {
    __map: {
      title: 'Shibuya Scramble Crossing',
      options: {
        ...DEFAULT_MAP,
        center: [139.70051, 35.65946],
        zoom: 17.8,
        pitch: 75,
        bearing: 205,
      },
    },
    __terrain: DEFAULT_TERRAIN,
    __building: DEFAULT_BUILDING,
  },
};
