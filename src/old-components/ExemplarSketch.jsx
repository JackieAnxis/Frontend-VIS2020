import React from 'react'
import Header from '../containers/Header'
import './ExemplarSketch.css'
import './common.css'
import { connect } from 'react-redux'
import * as VIS from '../vis'
import { Switch, Button, Icon } from 'antd'
import { autoLayout } from '../actions/exemplar'
import GraphD3 from './GraphD3'
import Sketcher from './Sketcher'

class ExemplarSketch extends React.Component {
	// static propTypes = {
	// 	graph: PropTypes.object
	// }

	constructor(props) {
		super(props)
		this.ref = React.createRef()
		this.state = {
			width: 386.66,
			height: 386.66,
			padding: 20,
			saveModify: 0,
			useSketch: false,
		}
	}

	componentWillReceiveProps(newProps) {
	}

	handleSaveModify = () => {
		let prev = this.state.saveModify + 1;
		this.setState({
			saveModify: prev
		})
	}
	// componentDidUpdate(prevProps) {
	// 	const width = 386.66;
	// 	const height = 386.66;
	// 	const padding = 20;

	//   // to modify
	// 	if (this.props.autoLayout) {
	// 		VIS.exemplarForce(this.ref.current, this.props.graph, width, height, padding)
	// 	} else {
	//     const points = VIS.exemplar(this.ref.current, this.props.graph, width, height, padding)
	//     this.props.dispatch(setExemplarDeformation(points));
	// 	}
	// }

	render() {
		return (
			<div id="ExemplarSketchViewContainer" className="top-container">
				<Header title="EXEMPLAR | SKETCH VIEW" />
				<div className="container" ref={this.ref}>
					{
						this.state.useSketch ?
							<Sketcher
								width={this.state.width}
								height={this.state.height}
							/>
							:
							this.props.exemplar.graph && <GraphD3
								dispatch={this.props.dispatch}
								data={this.props.exemplar.graph}
								width={this.state.width}
								height={this.state.height}
								padding={this.state.padding}
								id={"exemplar"}
								autoLayout={this.props.autoLayout}
								saveModify={this.state.saveModify}
							/>
					}
				</div>

				<div
					style={{
						position: 'absolute',
						top: 50,
						right: 10,
					}}
				>
					{
						// disable auto layout
						false && (this.props.exemplar.graph && this.props.exemplar.graph.nodes.length) && !this.state.useSketch &&
						<Button
							style={{ display: "block" }}
							shape='circle'
							icon='caret-right'
							size='large'
							onClick={() => {
								this.props.dispatch(autoLayout())
							}}
						/>
					}
				</div>
				<Switch
					style={{
						position: 'absolute',
						top: 50,
						right: 4,
					}}
					className={"ant-switch"}
					checkedChildren="exemplar"
					unCheckedChildren="sketcher"
					checked={!this.state.useSketch}
					onChange={(checked) => {
						this.setState({ useSketch: !checked })
					}}
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
					onClick={this.handleSaveModify}
				>
					COPY
        		</Button>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		exemplar: state.exemplar,
		sketch: state.sketcher
	}
}

export default connect(mapStateToProps)(ExemplarSketch)
