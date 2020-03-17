import React from 'react'
import { connect } from 'react-redux'
import { Button, Icon } from 'antd'
// import { copyDeformationHistory } from '../../actions/deformation'
import './SuggestionGallery.css'
import GraphD3 from '../GraphD3'

class SuggestionUnit extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: 195,
		  height: 195,
      padding: 10,
      deformFlag: false
    }
  }

  // handleCopy = () => {
  //   this.props.dispatch(copyDeformationHistory(this.props.historyId))
  // }

  render () {
    return (
      <div className="SuggestionLine">
          <GraphD3
            data={this.props.data.graph}
            width={this.state.width}
            height={this.state.height}
            padding={this.state.padding}
            id={this.props.id}
          />
        {/* <Button onClick={this.handleCopy}>COPY</Button> */}
      </div>
    )
  }
}

class SuggestionGallery extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    const allNodes = this.props.wholeGraphData.nodes;
    this.props.subgraphs.forEach(({ graph }) => {
			graph.nodes.forEach((node) => {
        // !!!wholeGraph里的node是按id排序的
        const n = allNodes[node.id];
				node.x = n.x;
				node.y = n.y;
			})
		})
    return (
      <div id="SuggestionGalleryContainer">
        {this.props.subgraphs.length > 0 &&
          <div id="SuggestionGalleryContent" className="scroll-box">{this.props.subgraphs.map((d,i) => 
            <SuggestionUnit
              // dispatch={this.props.dispatch}
              key={`subgraph-${i}`}
              data={d}
              id={`subgraph-${i}`}
            />
          )}
          </div>}
      </div>
    );
  }
}

function mapStateToProps(state) {
	return {
    subgraphs: state.suggestions.subgraphs,
    wholeGraphData: state.wholeGraph.graph,
	}
}

export default connect(mapStateToProps)(SuggestionGallery)
