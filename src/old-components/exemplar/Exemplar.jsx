import React from 'react'
import * as d3 from 'd3'
import Header from '../../containers/Header'
import '../common.css'
import GraphD3 from '../GraphD3'

class Exemplar extends React.Component {
    constructor(props) {
        super(props)
        this.ref = React.createRef()
    }

    componentDidUpdate() {
        if (this.props.onUpdate) {
            this.props.onUpdate()
        }
    }

    render() {
        return (
            <div className={this.props.class}>
                <Header title={this.props.title} />
                <div className={"container"} ref={this.ref}>
                    {
                        this.props.data && <GraphD3
                            dispatch={this.props.dispatch}
                            data={this.props.data}
                            markers={this.props.markers} // not general usage, only to get total number of markers
                            width={parseInt(d3.select(this.ref.current).style('width'))}
                            height={parseInt(d3.select(this.ref.current).style('height'))}
                            padding={20}
                            autoLayout={false}
                            onDragged={this.props.onDragged}
                            onClickNode={this.props.onClickNode}
                            saveModify={this.props.saveModify}
                            id={this.props.class}
                        />
                    }
                </div>
            </div>
        )
    }
}

export default Exemplar;
