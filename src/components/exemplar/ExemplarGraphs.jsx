import React from 'react'
import './ExemplarGraphs.css'
import '../common.css'
import { connect } from 'react-redux'
import Exemplar from './Exemplar.jsx'
import { Button } from 'antd';
import { toggleLassoSelect } from '../../actions/wholeGraph'
import {
    addSourceMarker,
    addTargetMarker,
    setSourceModified
} from '../../actions/graphs'
import { applyDeformationToSubgraph, applyDeformationToWholegraph } from '../../actions/deformation'
import { useState } from 'react'
import {
    CLEAR_SOURCE_MARKER,
    CLEAR_TARGET_MARKER
} from '../../actions/graphs'

function ExemplarGraphs({ graphs, lassoType, dispatch, wholeGraphData, allMarker }) {
    // const [saveModify, setSaveModify] = useState(0);
    // const [sourceMarkers, setSourceMarkers] = useState([]);
    // const [targetMarkers, setTargetMarkers] = useState([]);

    const onSetSourceMarker = (id) => {
        // sourceMarkers.push(id)
        // setSourceMarkers(sourceMarkers)
        dispatch(addSourceMarker(id))
    }

    const onSetTargetMarker = (id) => {
        // targetMarkers.push(id)
        // setTargetMarkers(targetMarkers)
        dispatch(addTargetMarker(id))
    }

    const onDraggedSource = (data) => {
        dispatch(setSourceModified(data))
    }

    // const handleSaveModify = () => {
    // let curr = saveModify + 1;
    // setSaveModify(curr);
    // }

    const applyDeformation = () => {
        console.log('paste')
        const {source, target} = allMarker;
        let autoMarkers = source.map((d,i)=>[d, target[i]]);
        const manualMarkers = [];
        for (let i = 0; i < graphs.sourceMarkers.length; i++) {
            manualMarkers.push([graphs.sourceMarkers[i], graphs.targetMarkers[i]]);
        }
        dispatch(applyDeformationToSubgraph({
            manualMarkers: manualMarkers,
            autoMarkers: autoMarkers,
            // nodeMaps: this.props.nodeMaps,
            sourceGraph: graphs.source,
            _sourceGraph: graphs.source_modified,
            targetGraph: graphs.target,
            // targetGraphId: 0, // TODO: useless
            // wholeGraphData: this.props.wholeGraphData
        }))
    }

    const onUpdateSource = () => {
        // setSourceMarkers([])
    }

    const onUpdateTarget = () => {
        // setSourceMarkers([])
    }

    const onApplySource2Graph = () => {
        const { source_modified } = graphs;
        if (!source_modified) {
            alert("Source graph hasn't been modified!")
        } else {
            let modifiedSourceGraph = {
                "source_modified": source_modified
            };
            dispatch(applyDeformationToWholegraph({
                wholeGraphData: wholeGraphData,
                deformedTargetGraph: modifiedSourceGraph
            }))
        }
    }

    const onApplyTarget2Graph = () => {
        const { target_generated } = graphs;
        if (!target_generated) {
            alert("Target graph hasn't been deformed!")
        } else {
            let deformedTargetGraph = {
                "target_generated": target_generated
            };
            dispatch(applyDeformationToWholegraph({
                wholeGraphData: wholeGraphData,
                deformedTargetGraph: deformedTargetGraph
            }))
        }
    }

    return (
        <div id='exemplar-graphs'>
            <Exemplar
                class={'source'}
                title={'SOURCE'}
                data={graphs.source}
                markers={graphs.sourceMarkers}
                onUpdate={onUpdateSource}
                onClickNode={onSetSourceMarker}
            />
            <Exemplar
                class={'source_modified'}
                title={'SOURCE MODIFIED'}
                data={graphs.source}
                onDragged={onDraggedSource}
            // saveModify={saveModify}
            />
            <Exemplar
                class={'target'}
                title={'TARGET'}
                data={graphs.target}
                markers={graphs.targetMarkers}
                onUpdate={onUpdateTarget}
                onClickNode={onSetTargetMarker}
            />
            <Exemplar
                class={'target_generated'}
                title={'TARGET GENERATED'}
                data={graphs.target_generated}
            />

            <Button
                style={{
                    position: 'absolute',
                    left: 355,
                    top: 3,
                }}
                shape='circle'
                icon='delete'
                onClick={() => {
                    dispatch({ type: CLEAR_SOURCE_MARKER })
                }}
            />
            <Button
                style={{
                    position: 'absolute',
                    display: "block",
                    left: 355,
                    top: 484,
                }}
                shape='circle'
                icon='delete'
                onClick={() => {
                    dispatch({ type: CLEAR_TARGET_MARKER })
                }}
            />

            <Button
                style={{
                    position: 'absolute',
                    display: "block",
                    left: 390,
                    top: 3,
                }}
                shape='circle'
                icon='drag'
                type={lassoType === 'source' ? 'primary' : 'normal'}
                onClick={() => {
                    dispatch(toggleLassoSelect('source'))
                }}
            />
            <Button
                style={{
                    position: 'absolute',
                    display: "block",
                    left: 390,
                    top: 484,
                }}
                shape='circle'
                icon='drag'
                type={lassoType == 'target' ? 'primary' : 'normal'}
                onClick={() => {
                    dispatch(toggleLassoSelect('target'))
                }}
            />
            <Button
                style={{
                    position: "absolute",
                    display: 'block',
                    top: 410,
                    left: 810,
                    color: '#aaa',
                    border: '1px solid',
                    width: 55
                }}
                ghost
                size="small"
            // onClick={handleSaveModify}
            >
                COPY
            </Button>
            <Button
                style={{
                    display: 'block',
                    position: "absolute",
                    top: 440,
                    left: 810,
                    color: '#aaa',
                    border: '1px solid',
                    width: 55
                }}
                ghost
                size="small"
                onClick={onApplySource2Graph}
            >
                APPLY
            </Button>
            <Button
                style={{
                    display: 'block',
                    position: 'absolute',
                    top: 890,
                    left: 810,
                    color: '#aaa',
                    border: '1px solid',
                    width: 55
                }}
                ghost
                size="small"
                onClick={applyDeformation}
            >
                PASTE
            </Button>
            <Button
                style={{
                    display: 'block',
                    position: 'absolute',
                    top: 920,
                    left: 810,
                    color: '#aaa',
                    border: '1px solid',
                    width: 55
                }}
                ghost
                size="small"
                onClick={onApplyTarget2Graph}
            >
                APPLY
            </Button>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        lassoType: state.lasso.type,
        graphs: state.graphs,
        wholeGraphData: state.wholeGraph.graph,
        allMarker: state.deformation.allMarker
    }
}


export default connect(mapStateToProps)(ExemplarGraphs);