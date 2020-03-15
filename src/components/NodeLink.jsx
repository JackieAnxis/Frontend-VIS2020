import React from 'react'
import Header from '../containers/Header'
import './NodeLink.css'
import './common.css'
import { connect } from 'react-redux'
import * as VIS from '../vis'
import { requestWholeGraph } from '../actions/wholeGraph'
import { newExemplar } from '../actions/exemplar'
import { toggleLasso } from '../actions/wholeGraph'

class NodeLink extends React.Component {
	// static propTypes = {
	// 	graph: PropTypes.object
	// }
	constructor(props) {
		super(props)
		this.ref = React.createRef()
		this.onSelection = this.onSelection.bind(this)
	}

	componentDidMount() {
		// request data
		this.props.dispatch(requestWholeGraph())
	}

	onSelection(data) {
		this.props.dispatch(newExemplar(data))
	}

	componentDidUpdate() {
		// VIS.nodeLinkG(this.ref.current, this.props.graph, this.onSelection, this.props.cluster)
		if (this.props.graph) {
			// if (window.g) { // TODO: bad, really really bad
			// VIS.updateNodeLinkG(window.g, this.props.graph)
			// } else {
			VIS.nodeLinkG(this.ref.current, this.props.graph, this.onSelection)
			// }
		}
	}

	render() {
		return (
			<div
				id="NodeLinkViewContainer"
				className="top-container"
			>
				<Header title="NODE-LINK VIEW" />
				<div className="container">
					<canvas ref={this.ref}></canvas>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return state.wholeGraph
	// return { name, graph } = state.wholeGraph;
}

export default connect(mapStateToProps)(NodeLink)
