import React from 'react'
import { connect } from 'react-redux'
import { requestWholeGraph } from '../actions/wholeGraph'

class WholeGraph extends React.Component {
    componentDidMount() {
        this.props.dispatch(requestWholeGraph())
    }
    render() {
        return (
            <div>
                {this.props.name}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return state.wholeGraph
}

export default connect(mapStateToProps)(WholeGraph)