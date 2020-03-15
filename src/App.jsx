import React from 'react'
import { Provider } from 'react-redux'
import configureStore from './configureStore'
import WholeGraph from './components/WholeGraph'

export const store = configureStore()

class App extends React.Component {
    constructor() {
        super()
        this.state = { graph: {} }
    }
    render() {
        return (
            <Provider store={store}>
                <WholeGraph />
            </Provider>
        )
    }
}

export default App
