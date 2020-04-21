import React from 'react'
import { Button, Input } from 'antd'
import { connect } from 'react-redux'
import { defaultSearchParams } from '../../configs'
import { requestSuggestions } from '../../actions/suggestions'
import './ControlPanel.css'
import '../common.css'

function onChangeTemplate(o, key) {
	return function ({ target: { value } }) {
		o[key] = +value
	}
}

class ParamInput extends React.Component {
	render() {
    let inputClassName = "";
    if (this.props.label === 'ℇ') {
      inputClassName ="-last"
    }
		return (
			<div className={`param-container${inputClassName}`}>
				<div className="param-label">{this.props.label}</div>
				<Input onChange={this.props.onChange} className={`param-input${inputClassName}`} defaultValue={this.props.defaultValue} />
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
		// this.props.dispatch(autoLayout())
  }
  
  onApplyDeformation = () => {
    // this.props.dispatch(applyDeformationToWholegraph({
    //   wholeGraphData: this.props.wholeGraphData,
    //   deformedTargetGraph: this.props.deformedTargetGraph
    // }))
  }

  componentDidMount(){
    this.searchParamas.nodes = this.props.sourceGraph.nodes.map((node) => node.id)
  }
	componentWillReceiveProps(newProps) {
		console.log(`ControPanel, received props:`, newProps)
		// if ('exemplar' in newProps && 'graph' in newProps.exemplar && newProps.exemplar.graph) {
			this.searchParamas.nodes = newProps.sourceGraph.nodes.map((node) => node.id)
		// }
	}

	render() {
		const paramsTemplate = ['min', 'max', 'k', 'sim'].map((key) => ({
			label: key.toUpperCase(),
			key
		}))
		/*
		paramsTemplate.push({
			label: 'ℇ',
			key: 'eps'
		})
		*/
		const self = this
		return (
			<div id="ControlPanelContainer">
				{/* <Header title="CONTROL PANEL" /> */}
				<div id="ControlPanelBody">
					<div className="search-param-container">
						{paramsTemplate.map((element) => (
							<ParamInput
								key={element.key}
								label={element.label}
								defaultValue={self.searchParamas[element.key]}
								onChange={onChangeTemplate(self.searchParamas, element.key)}
							/>
						))}
					</div>
          <div style={{margin: '0 auto', width: '100px'}}>
            <Button
              style={{
                width: '90px',
                height: '25px'
                // position: 'absolute',
                // bottom: 10,
                // right: 10
              }}
              type="primary"
              onClick={this.onQuery}>
              QUERY
            </Button>
          </div>
					{/* <div className='operations-container'>
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
					</div> */}
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

export default connect(mapStateToProps)(ControlPanel)
