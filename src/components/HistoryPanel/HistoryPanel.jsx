import React from 'react'
import { connect } from 'react-redux'
import { Button, Icon } from 'antd'
import { copyDeformationHistory } from '../../actions/deformation'
import './HistoryPanel.css'
import GraphD3 from '../GraphD3'

class HistoryUnit extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: 200,
		  height: 200,
      padding: 20,
      deformFlag: false
    }
  }

  handleCopy = () => {
    this.props.dispatch(copyDeformationHistory(this.props.historyId))
  }

  render () {
    return (
      <div className="HistoryLine">
        <div className="HistoryItem">
          <GraphD3
            data={this.props.data.beforeGraph}
            width={this.state.width}
            height={this.state.height}
            padding={this.state.padding}
            id={"history"}
          />
        </div>
        <div className="HistorySplitLine"></div>
        <div className="HistoryItem">
          <GraphD3
            data={this.props.data.afterGraph}
            width={this.state.width}
            height={this.state.height}
            padding={this.state.padding}
            id={"history"}
          />
        </div>
        <Button onClick={this.handleCopy}>COPY</Button>
      </div>
    )
  }
}

class HistoryPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPanelOpen: false
    }
  }
  
  handleBarClick = () => {
    let prevIsPanelOpen = this.state.isPanelOpen;
    this.setState({
      isPanelOpen: !prevIsPanelOpen
    })
  }

  render () {
    return (
      <div id="HistoryPanelContainer">
        <div id="ClickIcon">
          <Icon type={this.state.isPanelOpen ? "right-square-o" : "left-square-o"} onClick={this.handleBarClick}/>
        </div>
        <div id="HistoryPanelBody" style={{ display: this.state.isPanelOpen ? "block":"none"}}>
          <div id="HistoryTitle">HISTORY</div>
          {this.props.history ? <div id="HistoryPanelContent" className="scroll-box">{this.props.history.map((d,i) => 
            <HistoryUnit
              dispatch={this.props.dispatch}
              key={`history-${i}`}
              data={d}
              historyId={i}
            />
          )}</div> : <div id="InfoText">
            No history.
          </div>
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
	return {
    history: state.deformation.history
	}
}

export default connect(mapStateToProps)(HistoryPanel)
