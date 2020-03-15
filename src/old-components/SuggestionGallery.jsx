import React from 'react'
import { connect } from 'react-redux'
import Header from '../containers/Header'
// import * as VIS from '../vis'
import { Pagination, Button } from 'antd'
import { applyDeformationToSubgraph } from '../actions/deformation'
import './SuggestionGallery.css'
import './common.css'
import GraphD3 from './GraphD3'

class GraphUnit extends React.Component {
	constructor(props) {
		super(props)
		this.ref = React.createRef()
		this.state = {
			width: 276,
			height: 261,
			padding: 20,
			deformFlag: false
		}
	}
 
  onApply = () => {
    const {allMarker, sourceGraph, deformedSourceGraph} = this.props.deformationState;
    const targetMarker = allMarker[this.props.id];
    const exemplarMarker = allMarker["markerForDeform"];
    if(exemplarMarker) {
      let points = exemplarMarker.map((d,i)=>[d, targetMarker[i]]);
      if (deformedSourceGraph) {
        this.props.dispatch(applyDeformationToSubgraph({
          markers: points,
        //   nodeMaps: this.props.nodeMaps,
          sourceGraph: sourceGraph,//this.props.exemplarGraph,
          _sourceGraph: deformedSourceGraph,
          targetGraph: {"nodes": this.props.graph.nodes, "links": this.props.graph.links},
        //   targetGraphId: this.props.id,
          // wholeGraphData: this.props.wholeGraphData
        }))
      }
      this.setState({
        deformFlag: true
      })
    }
  }

	render() {
    let data = this.props.graph;
    if (this.state.deformFlag && this.props.deformationState.deformedTargetGraph) {
      data = this.props.deformationState.deformedTargetGraph[this.props.id];
    }
		return (
			<div
				style={{
					position: 'relative',
					display: this.props.display ? 'block' : 'none'
				}}
				onMouseEnter={this.props.onMouseEnter}
				onMouseLeave={this.props.onMouseLeave}
				ref={this.ref}
				className="suggestion-unit"
			>
				{this.props.graph && <GraphD3
					dispatch={this.props.dispatch}
					data={data}
					deformFlag={this.state.deformFlag}
					width={this.state.width}
					height={this.state.height}
					padding={this.state.padding}
					id={this.props.id}
				/>}
				<Button
					style={{
						position: 'absolute',
						bottom: 4,
						right: 4,
						color: '#aaa',
						border: '1px solid'
					}}
					ghost
					size = "small"
					onClick={this.onApply}
				>
					PASTE
        		</Button>
			</div>
		)
	}
}

class SuggestionGallery extends React.Component {
	// static propTypes = {
	// 	graph: PropTypes.object
	// }

	constructor(props) {
		super(props)
		this.state = {
			currPage: 1,
			totalItems: 0
		}
	}

	componentWillReceiveProps(newProps) {
		// console.log(`Suggestion Gallery will receive props: ${JSON.stringify(newProps)}`)
    if(newProps.suggestions.subgraphs.length !== this.props.suggestions.subgraphs.length)
      this.setState({
        totalItems: newProps.suggestions.subgraphs.length,
        currPage: 1
      })
	}

	onMouseEnterSuggestion = (graph) => {
		window.ADMIN.highlightSubGraph(graph)
	}

	onMouseLeaveSuggestion = () => {
		// console.log(graph);
		window.ADMIN.clearHighlight()
	}

	onChangePage = (page) => {
		this.setState({
			currPage: page
		})
	}

	render() {
		const graphs = this.props.suggestions.subgraphs
		const deformationState = this.props.deformation
		const exemplarGraph = this.props.exemplar.graph
		graphs.forEach(({ graph, node_maps }) => {
			graph.nodes.forEach((node) => {
				const n = window.g.getNodeById('' + node.id)
				node.x = n.x
				node.y = n.y
			})
		})
		return (
			<div id="SuggestionGalleryContainer" className="top-container">
				<Header title="SUGGESTION GALLERY">
					<div
						style={{
							display: 'inline-block',
							textIndent: 0
						}}>
						{this.state.totalItems > 0 ? (
							<Pagination
								size="small"
								total={this.state.totalItems}
								onChange={this.onChangePage}
								current={this.state.currPage}
								defaultPageSize={6}
							/>
						) : null}
					</div>
				</Header>
				<div id="SuggestionGalleryBody" className="container">
					<div
						style={{
							width: '100%',
							height: '100%',
							display: 'flex',
							flexWrap: 'wrap',
							// overflow: 'scroll',
							alignContent: 'stretch',
							padding: '5px'
						}}>
						{graphs.map(({ graph, node_maps }, i) => (
							<GraphUnit
								key={i}
								display={parseInt(i / 6) == this.state.currPage - 1}
								onMouseEnter={() => {
									this.onMouseEnterSuggestion(graph)
								}}
								onMouseLeave={() => {
									this.onMouseLeaveSuggestion()
								}}
								dispatch={this.props.dispatch}
								graph={graph}
								id={`subgraph-${i}`}
                deformationState={deformationState}
                // wholeGraphData={this.props.wholeGraph.graph}
								exemplarGraph={exemplarGraph}
								nodeMaps={node_maps}
							/>
						))}
					</div>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		suggestions: state.suggestions,
		wholeGraph: state.wholeGraph,
		deformation: state.deformation,
		exemplar: state.exemplar
	}
}

export default connect(mapStateToProps)(SuggestionGallery)
