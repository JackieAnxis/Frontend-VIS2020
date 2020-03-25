import React from 'react'
import { Provider } from 'react-redux'
import configureStore from './configureStore'
import WholeGraph from './components/WholeGraph'
import Exemplar from './components/Exemplar/Exemplar'

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
                    <WholeGraph />
                    <Exemplar
                        class={'source_modified'}
                        title={'SOURCE MODIFIED'}
                        // graph={source.sourceOrigin}
                        // markers={source.sourceMarkers}
                        // graph={this.props.lassoType === 'source' ? this.props.graphsInfo.source : this.props.graphsInfo.target}
                        // markers={this.props.lassoType === 'source' ? this.props.graphsInfo.sourceMarkers : this.props.graphsInfo.targetMarkers}
                        onDragged={() => { }} />
                </div>

            </Provider>
        )
    }
}

export default App
