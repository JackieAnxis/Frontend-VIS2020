import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { modifyGraph } from '../actions';
import * as VIS from '../vis';

function Graph(props) {
    const { dispatch, data, name, title } = props;
    const width = 500;
    const height = 500;
    const padding = 50;

    let resultGraph = null

    const ref = React.createRef();
    useEffect(() => {
        // d3 draw graph here
        if (data) { // TODO: not elegant
            function onDragged() {
                const data = resultGraph.getData();
                console.log(resultGraph.getData());
                dispatch(modifyGraph(name, data));
            }
            resultGraph = VIS.graph(ref.current, data, width, height, padding, onDragged);
        }
    }, [data]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                margin: 5,
            }}
        >
            <p>{title}</p>
            <div ref={ref}></div>
        </div>
    );
}

export default connect()(Graph);
