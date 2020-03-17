import React from 'react'
import * as d3 from 'd3'
import { connect } from 'react-redux'
// import Header from '../../containers/Header'
import { Button } from 'antd'
import ControlPanel from '../ControlPanel/ControlPanel'
import SuggestionGallery from '../SuggestionGallery/SuggestionGallery'
import '../common.css'
import './Exemplar.css'
import GraphD3 from '../GraphD3'

class Exemplar extends React.Component {
    constructor(props) {
        super(props)
        this.ref = React.createRef()
        this.state = {
          saveModify: 0
        }
    }

    componentDidUpdate() {
        if (this.props.onUpdate) {
            this.props.onUpdate()
        }
    }

    handleSaveModify = () => {
      let prev = this.state.saveModify + 1;
      this.setState({
        saveModify: prev
      })
    }

    render() {
        return (
            <div className={this.props.class}>
                {/* <Header title={this.props.title} /> */}
                <div ref={this.ref}>
                    {
                        this.props.graph && <GraphD3
                            dispatch={this.props.dispatch}
                            data={this.props.graph}
                            markers={this.props.markers} // not general usage, only to get total number of markers
                            width={300}
                            height={300}
                            padding={20}
                            autoLayout={false}
                            onDragged={this.props.onDragged}
                            // onClickNode={this.props.onClickNode}
                            saveModify={this.state.saveModify}
                            id={this.props.class}
                        />
                    }
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
                <ControlPanel/>
                <SuggestionGallery />
            </div>
        )
    }
}

function mapStateToProps(state) {
  return {
      // lassoType: state.lasso.type,
      // graph: state.graphs.source,
      // wholeGraphData: state.wholeGraph.graph,
      // allMarker: state.deformation.allMarker
  }
}

export default connect(mapStateToProps)(Exemplar);
