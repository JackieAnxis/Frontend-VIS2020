import React from 'react'
import { Button, Input } from 'antd'
import { connect } from 'react-redux'
import { defaultSearchParams } from '../config'
import Header from '../containers/Header'
import { requestSuggestions } from '../actions/suggestions'
import { autoLayout } from '../actions/exemplar'
import { applyDeformationToWholegraph } from '../actions/deformation'
import './ControlPanel.css'
import './common.css'

function onChangeTemplate(o, key) {
	return function ({ target: { value } }) {
		o[key] = +value
	}
}

class ParamInput extends React.Component {
	render() {
		return (
			<div className="param-container">
				<div className="param-label">{this.props.label}</div>
				<Input onChange={this.props.onChange} className="param-input" defaultValue={this.props.defaultValue} />
			</div>
		)
	}
}

class ControlPanel extends React.Component {
	constructor(props) {
		super(props)
		this.searchParamas = defaultSearchParams
	}

	onQuery = () => {
		console.log(JSON.stringify(this.searchParamas))
		this.props.dispatch(
			requestSuggestions({
				dataset: this.props.dataset,
				search_nodes: this.searchParamas.nodes,
				min_nodes_threshold: this.searchParamas.min,
				max_nodes_threshold: this.searchParamas.max,
				k: this.searchParamas.k,
				similarity_threshold: this.searchParamas.sim,
				eps: this.searchParamas.eps
			})
		)
	}

	onAutoLayout = () => {
		this.props.dispatch(autoLayout())
  }
  
  onApplyDeformation = () => {
    this.props.dispatch(applyDeformationToWholegraph({
      wholeGraphData: this.props.wholeGraphData,
      deformedTargetGraph: this.props.deformedTargetGraph
    }))
  }

	componentWillReceiveProps(newProps) {
		console.log(`ControPanel, received props:`, newProps)
		if ('exemplar' in newProps && 'graph' in newProps.exemplar && newProps.exemplar.graph) {
			this.searchParamas.nodes = newProps.exemplar.graph.nodes.map((node) => node.id)
		}
	}

	render() {
		const paramsTemplate = ['min', 'max', 'k', 'sim'].map((key) => ({
			label: key.toUpperCase(),
			key
		}))
		paramsTemplate.push({
			label: 'ℇ',
			key: 'eps'
		})
		const self = this
		return (
			<div id="ControlPanelContainer" className="top-container">
				<Header title="CONTROL PANEL" />
				<div id="ControlPanelBody" className="container">
					<div className="search-param-container">
						{paramsTemplate.map((element) => (
							<ParamInput
								key={element.key}
								label={element.label}
								defaultValue={self.searchParamas[element.key]}
								onChange={onChangeTemplate(self.searchParamas, element.key)}
							/>
						))}
						<Button
							style={{
								position: 'absolute',
								bottom: 10,
								right: 10
							}}
							type="primary"
							onClick={this.onQuery}>
							QUERY
						</Button>
					</div>
					<div className='operations-container'>
            <Button
							style={{
								position: 'absolute',
								bottom: 10,
								right: 10
							}}
							type="primary"
							onClick={this.onApplyDeformation}>
							APPLY DEFORMATION
						</Button>
					</div>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		dataset: state.wholeGraph.name,
    exemplar: state.exemplar,
    wholeGraphData: state.wholeGraph.graph,
    deformedTargetGraph: state.deformation.deformedTargetGraph
	}
}

export default connect(mapStateToProps)(ControlPanel)
