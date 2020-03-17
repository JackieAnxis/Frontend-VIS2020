export const SET_TARGET_GENERATED = 'SET_TARGET_GENERATED';

export const ADD_SOURCE_MARKER = 'ADD_SOURCE_MARKER';
export const ADD_TARGET_MARKER = 'ADD_TARGET_MARKER';

export const CLEAR_SOURCE_MARKER = 'CLEAR_SOURCE_MARKER';
export const CLEAR_TARGET_MARKER = 'CLEAR_TARGET_MARKER';


export function addSourceMarker(id) {
    return {
        type: ADD_SOURCE_MARKER,
        id,
    }
}

export function addTargetMarker(id) {
    return {
        type: ADD_TARGET_MARKER,
        id,
    }
}

export function setTargetGenerated(data) {
    return {
        type: SET_TARGET_GENERATED,
        data
    }
}