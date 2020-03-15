import React from 'react'
import * as d3 from 'd3'
import { Provider } from 'react-redux'
import NodeLink from './components/NodeLink'
import SuggestionGallery from './components/SuggestionGallery'
import ExemplarSketch from './components/ExemplarSketch'
import ControlPanel from './components/ControlPanel'
import HistoryPanel from './components/HistoryPanel/HistoryPanel'
import configureStore from './configureStore'

export const store = configureStore()

class App extends React.Component {
	constructor() {
		super()
		this.state = { graph: {} }
	}
	render() {
		return (
			<Provider store={store}>
				<div>
					<NodeLink />
					<ExemplarSketch />
					<SuggestionGallery />
					<ControlPanel />
          <HistoryPanel />
				</div>
			</Provider>
		)
	}
}

export default App
