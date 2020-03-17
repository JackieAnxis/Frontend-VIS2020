import React from 'react'
import * as d3 from 'd3'
import { connect } from 'react-redux'
// import Header from '../../containers/Header'
import { Button } from 'antd'
import ControlPanel from '../ControlPanel/ControlPanel'
import SuggestionGallery from '../SuggestionGallery/SuggestionGallery'
import '../common.css'
import './Exemplar.css'
import GraphD3 from '../GraphD3'
import { applyDeformationToSubgraph } from '../../actions/deformation'
import { addSourceMarker, addTargetMarker } from '../../actions/graphs'

class Exemplar extends React.Component {
    constructor(props) {
        super(props)
        this.ref = React.createRef()
        this.state = {
            saveModify: 0
        }
    }

    componentDidUpdate() {
        if (this.props.onUpdate) {
            this.props.onUpdate()
        }
    }

    handleSaveModify = () => {
        let prev = this.state.saveModify + 1;
        this.setState({
            saveModify: prev
        })
    }

    computeDeformation = () => {
        const { graphsInfo } = this.props;
        const manualMarkers = [];
        for (let i = 0; i < graphsInfo.sourceMarkers.length; i++) {
            manualMarkers.push([graphsInfo.sourceMarkers[i], graphsInfo.targetMarkers[i]]);
        }
        this.props.dispatch(applyDeformationToSubgraph({
            manualMarkers: manualMarkers,
            sourceGraph: graphsInfo.source,
            _sourceGraph: graphsInfo.sourceModified,
            targetGraph: graphsInfo.target,
        }))
    }

    onClickNode = (id) => {
        if (this.props.exemplarType === 'source') {
            this.props.dispatch(addSourceMarker(id))
        } else {
            this.props.dispatch(addTargetMarker(id))
        }
        console.log(id)
    }

    render() {
        return (
            <div className={this.props.class}>
                {/* <Header title={this.props.title} /> */}
                <div ref={this.ref}>
                    {
                        this.props.graph && <GraphD3
                            dispatch={this.props.dispatch}
                            data={this.props.graph}
                            markers={this.props.markers} // not general usage, only to get total number of markers
                            width={300}
                            height={300}
                            padding={20}
                            autoLayout={false}
                            onDragged={this.props.onDragged}
                            onClickNode={this.onClickNode}
                            saveModify={this.state.saveModify}
                            id={this.props.class}
                        />
                    }
                    <Button
                        style={{
                            position: 'absolute',
                            bottom: 4,
                            right: 4,
                            color: '#aaa',
                            border: '1px solid'
                        }}
                        ghost
                        size="small"
                        onClick={() => {
                            if (this.props.exemplarType === 'source') {
                                this.handleSaveModify()
                            } else {
                                this.computeDeformation()
                            }
                        }}
                    >
                        {
                            this.props.exemplarType === 'source' ? 'COPY' : 'PASTE'
                        }
                    </Button>
                </div>
                <ControlPanel />
                <SuggestionGallery />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        // lassoType: state.lasso.type,
        // graph: state.graphs.source,
        // wholeGraphData: state.wholeGraph.graph,
        // allMarker: state.deformation.allMarker
        exemplarType: state.wholeGraph.lassoType,
        graphsInfo: state.graphs, // NOTE: redundant, for convenience of getting markers
    }
}

export default connect(mapStateToProps)(Exemplar);
