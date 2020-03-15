export const SET_SKETCH_EXEMPLAR = 'SET_SKETCH_EXEMPLAR';

export function setSketch(graph) {
    return {
        type: SET_SKETCH_EXEMPLAR,
        graph
    }
}