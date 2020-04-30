export const backendAddress = 'http://127.0.0.1:7777';
export const searchAPI = 'search';

export const defaultSearchParams = {
  min: 3,
  max: 10,
  k: 100,
  sim: 0.5,
  eps: 0.00001,
  nodes: [],
};

export const defalutStyle = {
  wholeGraph: {
      bgColor: {
          r: 1, //238 / 255,
          g: 1, //238 / 255,
          b: 1, //238 / 255,
          a: 1,
      },
      nodeHighlight: {
          r: 5,
          fill: {
              r: 230 / 255,
              g: 92 / 255,
              b: 73 / 255,
              a: 1,
          },
          strokeWidth: 1,
          strokeColor: {
              r: 200 / 255,
              g: 36 / 255,
              b: 144 / 255,
              a: 0.1,
          },
      },
      node: {
          r: 5,
          fill: {
              r: 36 / 255,
              g: 144 / 255,
              b: 200 / 255,
              a: 0.5,
          },
          strokeWidth: 1,
          strokeColor: {
              r: 200 / 255,
              g: 36 / 255,
              b: 144 / 255,
              a: 0.1,
          },
      },
      linkHighLight: {
          strokeWidth: 3,
          strokeColor: {
              r: 228 / 255,
              g: 164 / 255,
              b: 155 / 255,
              a: 1,
          },
      },
      link: {
          strokeWidth: 3,
          strokeColor: {
              r: 153 / 255,
              g: 153 / 255,
              b: 153 / 255,
              a: 0.1,
          },
      },
  },
};