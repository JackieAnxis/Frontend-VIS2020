import React, { useEffect } from 'react';
import Graph from './Graph';
import { connect } from 'react-redux';
import { requestData } from '../actions';

function GraphArea(props) {
    const { dispatch, graphData } = props;
    useEffect(() => {
        dispatch(requestData());
    }, []);

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                }}
            >
                <Graph title={'source'} name={'source'} data={graphData.source} />
                <Graph
                    title={'source-modified'}
                    name={'source_modified'}
                    data={graphData.source_modified}
                />
            </div>
            <div
                style={{
                    display: 'flex',
                }}
            >
                <Graph title={'target'} name={'target'} data={graphData.target} />
                <Graph
                    title={'target-generated'}
                    name={'target_generated'}
                    data={graphData.target_generated}
                />
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    const { testGraphs } = state;
    return { graphData: testGraphs };
}

export default connect(mapStateToProps)(GraphArea);
