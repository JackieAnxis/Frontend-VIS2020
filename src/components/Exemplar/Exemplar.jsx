import React from 'react'
import * as d3 from 'd3'
import { connect } from 'react-redux'
import Header from '../Header'
import { Button } from 'antd'
import ControlPanel from '../ControlPanel/ControlPanel'
import Params from '../Params/Params'
import SuggestionGallery from '../SuggestionGallery/SuggestionGallery'
import '../common.css'
import './Exemplar.css'
import GraphD3 from '../GraphD3'
import { setViewCenter } from '../../actions/wholeGraph'
import { addSourceMarker } from '../../actions/graphs'

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
        const { sourceMarkers } = this.props.graphsInfo.source;
        if (!sourceMarkers.length) {
            alert("Please set markers before copying!")
        } else {
            let prev = this.state.saveModify + 1;
            this.setState({
                saveModify: prev
            })
        }
    }

    onClickNode = (nodeId, graphId) => {
        this.props.dispatch(addSourceMarker(nodeId))
    }

    onSetViewCenter = () => {
        if (!this.props.viewCenter || JSON.stringify(this.props.viewCenter.nodes) !== JSON.stringify(this.props.graph.nodes)) {
            this.props.dispatch(setViewCenter(this.props.graph))
        }
    }

    render() {
        const show = !!this.props.graphsInfo.source.sourceOrigin;
        return (
            <div
                style={{
                    width: show ? 320 : 0,
                    border: show ? '10px solid rgb(238, 238, 238)' : '0px',
                }}
                className={'exemplar_panel_container'}
            >
                {
                    show && (
                        <div>
                            <div className={this.props.class}>
                                <Header title={this.props.title} />
                                <div ref={this.ref} style={{
                                    height: 280,
                                    position: 'absolute',
                                    top: 40,
                                }} onClick={this.onSetViewCenter}>
                                    {
                                        this.props.graphsInfo.source.sourceOrigin && <GraphD3
                                            dispatch={this.props.dispatch}
                                            data={this.props.graphsInfo.source.sourceOrigin}
                                            markers={this.props.graphsInfo.source.sourceMarkers} // not general usage, only to get total number of markers
                                            width={300}
                                            height={280}
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
                                        onClick={() => this.handleSaveModify()}
                                    >
                                        COPY
                                    </Button>
                                </div>
                            </div>
                            <ControlPanel />
                            <Params />
                            <SuggestionGallery />
                        </div>
                    )
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        // lassoType: state.lasso.type,
        graph: state.graphs.source.sourceOrigin,
        // wholeGraphData: state.wholeGraph.graph,
        // allMarker: state.deformation.allMarker
        exemplarType: state.wholeGraph.lassoType,
        graphsInfo: state.graphs, // NOTE: redundant, for convenience of getting markers
        viewCenter: state.wholeGraph.viewCenter,
    }
}

export default connect(mapStateToProps)(Exemplar);
