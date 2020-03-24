import React from 'react'
import { connect } from 'react-redux'
import { Button, Icon } from 'antd'
import { addTargetMarker } from '../../actions/graphs'
import { applyDeformationToSubgraph } from '../../actions/deformation'
import { setViewCenter } from '../../actions/wholeGraph'
// import { copyDeformationHistory } from '../../actions/deformation'
import './SuggestionGallery.css'
import GraphD3 from '../GraphD3'
import Header from '../Header'

class SuggestionUnit extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: 190,
      height: 190,
      padding: 15,
      deformFlag: false
    }
  }

  // handleCopy = () => {
  //   this.props.dispatch(copyDeformationHistory(this.props.historyId))
  // }
  onClickNode = (nodeId, graphId) => {
    this.props.dispatch(addTargetMarker(nodeId, graphId))
  }

  computeDeformation = () => {
    const { sourceMarkers, sourceOrigin, sourceModified } = this.props.source;
    const targetOrigin = this.props.data;
    const targetMarkers = this.props.markers;
    const graphId = this.props.id;
    if (!sourceMarkers.length || !targetMarkers.length) {
      alert("Please set markers before pasting!")
    } else if (!sourceModified) {
      alert("Please copy modified graph before pasting!")
    } else {
      const manualMarkers = [];
      for (let i = 0; i < sourceMarkers.length; i++) {
        manualMarkers.push([sourceMarkers[i], targetMarkers[i]]);
      }
      this.props.dispatch(applyDeformationToSubgraph({
        manualMarkers: manualMarkers,
        sourceGraph: sourceOrigin,
        _sourceGraph: sourceModified,
        targetGraph: targetOrigin,
        graphId: graphId
      }))
    }
  }

  onSetViewCenter = () => {
    if (!this.props.viewCenter || JSON.stringify(this.props.viewCenter.nodes) !== JSON.stringify(this.props.data.nodes))
      this.props.dispatch(setViewCenter(this.props.data))
  }

  render() {
    return (
      <div className="SuggestionLine" id={this.props.id} onClick={this.onSetViewCenter}>
        <GraphD3
          data={this.props.data}
          width={this.state.width}
          height={this.state.height}
          padding={this.state.padding}
          id={this.props.id}
          onClickNode={this.onClickNode}
          markers={this.props.markers}
        />
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
          onClick={this.computeDeformation}
        >PASTE
          </Button>
        {/* <Button onClick={this.handleCopy}>COPY</Button> */}
      </div>
    )
  }
}

class SuggestionGallery extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const allNodes = this.props.wholeGraphData.nodes;
    const { source, target } = this.props.graphsInfo;
    this.props.subgraphs.forEach(({ graph }) => {
      graph.nodes.forEach((node) => {
        // !!!wholeGraph里的node是按id排序的
        const n = allNodes[node.id];
        node.x = n.x;
        node.y = n.y;
      })
    })
    const displayedSubgraph = target//this.props.subgraphs.map(d=>d.graph);
    const ids = Object.keys(displayedSubgraph);

    return (
      <div id="SuggestionGalleryContainer">
        {ids.length > 0 &&
          <div>
            <Header title='SUGGESTIONS' />
            <div id="SuggestionGalleryContent" className="scroll-box">{ids.map((id) =>
              <SuggestionUnit
                dispatch={this.props.dispatch}
                key={id}
                markers={displayedSubgraph[id].targetMarkers}
                data={displayedSubgraph[id].targetGenerated ? displayedSubgraph[id].targetGenerated : displayedSubgraph[id].targetOrigin}
                source={source}
                id={id}
                viewCenter={this.props.viewCenter}
              />
            )}
            </div>
          </div>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    subgraphs: state.suggestions.subgraphs,
    wholeGraphData: state.wholeGraph.graph,
    viewCenter: state.wholeGraph.viewCenter,
    graphsInfo: state.graphs
  }
}

export default connect(mapStateToProps)(SuggestionGallery)
