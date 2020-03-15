import React from 'react'
import * as d3 from 'd3'
import { Provider } from 'react-redux'
import NodeLink from './components/NodeLink'
import configureStore from './configureStore'
import ExemplarGraphs from './components/exemplar/ExemplarGraphs'

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
                    <ExemplarGraphs />
                </div>
            </Provider>
        )
    }
}

export default App
