import React from 'react'
import { Button, Input } from 'antd'
import './Params.css'
import '../common.css'

class ParamInput extends React.Component {
	render() {
    let inputClassName = "";
    if (this.props.label === 'ℇ') {
      inputClassName ="-last"
    }
		return (
			<div className={`Params-param-container${inputClassName}`}>
				<div className="param-label">{this.props.children}</div>
				<Input onChange={this.props.onChange} className={`Params-param-input${inputClassName}`} defaultValue={this.props.defaultValue} />
			</div>
		)
	}
}

class Params extends React.Component {
	constructor(props) {
		super(props)
	}

	onQuery = () => {
	}

	onAutoLayout = () => {
		// this.props.dispatch(autoLayout())
  }
  
  onApplyDeformation = () => {
    // this.props.dispatch(applyDeformationToWholegraph({
    //   wholeGraphData: this.props.wholeGraphData,
    //   deformedTargetGraph: this.props.deformedTargetGraph
    // }))
  }

	render() {
		const paramsTemplate = ['a', 'ß', 'w<sub>M</sub>'].map((key) => ({
			label: key.toUpperCase(),
			key
		}))
		return (
			<div id="ParamsContainer">
				{/* <Header title="CONTROL PANEL" /> */}
				<div id="ParamsBody">
					<div className="search-param-container">
						<ParamInput
							defaultValue='1.0'
						>
							&alpha;	
						</ParamInput>
						<ParamInput
							defaultValue='1.0'
						>
							&beta;
						</ParamInput>
						<ParamInput
							defaultValue='1.0'
						>
							w
						</ParamInput>
						<ParamInput
							defaultValue='1.0'
						>
							w<sub>M</sub>
						</ParamInput>
					</div>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		dataset: state.wholeGraph.name,
    // exemplar: state.exemplar,
    wholeGraphData: state.wholeGraph.graph,
    sourceGraph: state.graphs.source.sourceOrigin
    // deformedTargetGraph: state.deformation.deformedTargetGraph
	}
}

export default Params
