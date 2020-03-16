import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import { lasso as d3Lasso } from 'd3-lasso'
import { requestWholeGraph } from '../actions/wholeGraph'
import { generateSubgraph } from '../actions/subGraph'
import { GraphTransformer } from '../utils/vis'
import Header from './Header'
import { Button, Switch } from 'antd'
import './common.css'
import './lasso.css'
import { setLassoResult, switchLassoType } from '../actions/wholeGraph'

window.d3 = d3 // NOTE: d3-lasso need global d3, f**k

const configs = {
    width: 1900, // 1920 - 20
    height: 1020, // 1080 - 40 - 20
    bgColor: 'rgba(238, 238, 238, 1)',
    node: {
        color: 'rgba(36, 144, 200, 0.5)',
        r: 5,
    },
    link: {
        color: 'rgba(153, 153, 153, 0.1)'
    },
    padding: 20,
}

class WholeGraph extends React.Component {
    constructor(props) {
        super(props);
        this.svgRef = React.createRef();
        this.lasso = null;
        this.zoom = null;
        this.state = {
          markers: [],
          graphName: ''
        }
    }
    componentDidMount() {
        this.props.dispatch(requestWholeGraph())
    }
    componentDidUpdate() {
      if(this.props.name !== this.state.graphName) {
        this.draw();
        console.log("update")
        this.setState({
          graphName: this.props.name
        })
      }
    }

    componentWillReceiveProps(nextProps) {
      // 如果已经加载了图
      if (this.state.graphName) {
        let subGraph = nextProps.subGraph;
        const svg = d3.select(this.svgRef.current);
        for (const node of subGraph) {
          svg.select(`#node-${node.id}`).classed('selected', true)
        }
      }
    }

    toggleLasso = (enable) => {
        const svg = d3.select(this.svgRef.current);
        if (enable) {
            svg.on('.zoom', null);
            svg.call(this.lasso);
        } else {
            svg.call(this.zoom);
            svg.on('.dragstart', null);
            svg.on('.drag', null);
            svg.on('.dragend', null);
        }
    }

    draw = () => {
        let _this = this;
        let markers = this.state.markers;
        if (!this.props.graph || !this.props.graph.nodes) {
            return;
        }
        const transformer = GraphTransformer(this.props.graph, configs.width, configs.height, configs.padding);
        const visData = transformer.transform();
        const nodes = visData.nodes;
        const links = visData.links;
        const nodeMap = {};
        for (const n of nodes) {
            nodeMap[n.id] = n;
        }

        const svg = d3.select(this.svgRef.current);
        svg.selectAll('*').remove();
        svg
            .attr('width', configs.width)
            .attr('height', configs.height)
            .style('background', configs.bgColor)
            .attr('viewBox', [0, 0, configs.width, configs.height]);

        const link = svg.append("g")
            .attr("stroke", configs.link.color)
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", 3)
            .attr("x1", d => nodeMap[d.source].x)
            .attr("y1", d => nodeMap[d.source].y)
            .attr("x2", d => nodeMap[d.target].x)
            .attr("y2", d => nodeMap[d.target].y)

        const node = svg.append("g")
            .attr('id', 'nodes')
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", configs.node.r)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr("fill", configs.node.color)
            .attr("id", d => `node-${d.id}`)
            .on("click", clickMarker)
        function clickMarker (node) {
          let target = d3.event.target;
          const nodeId = node.id;
          const pos = markers.indexOf(nodeId);
          if (pos < 0) {
            markers.push(nodeId);
            d3.select(target).classed("selected", true);
          } else {
            markers.splice(pos, 1);
            d3.select(target).classed("selected", false);
          }
          _this.setState({
            markers: markers
          })
        }
        const lasso_start = function () {
            this.lasso.items()
                // .attr("r", 7)
                .classed("not_possible", true)
                .classed("selected", false);
        };

        const lasso_draw = function () {
            this.lasso.possibleItems()
                .classed("not_possible", false)
                .classed("possible", true);
            this.lasso.notPossibleItems()
                .classed("not_possible", true)
                .classed("possible", false);
        };

        const lasso_end = function () {
            this.lasso.items()
                .classed("not_possible", false)
                .classed("possible", false);
            this.lasso.selectedItems()
                .classed("selected", true)
                .attr("r", 7);
            this.lasso.notSelectedItems()
                .attr("r", configs.node.r);

            const items = this.lasso.selectedItems().data();
            this.props.dispatch(setLassoResult(items, this.props.lassoType));
        };

        this.lasso = d3Lasso()
            .closePathDistance(305)
            .closePathSelect(true)
            .targetArea(svg)
            .items(node)
            .on("start", lasso_start.bind(this))
            .on("draw", lasso_draw.bind(this))
            .on("end", lasso_end.bind(this));


        // lasso, init disable
        // svg.call(this.lasso);
        this.zoom = d3.zoom()
        .extent([[0, 0], [configs.width, configs.height]])
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

        svg.call(this.zoom);
        // zoom
        function zoomed() {
            link.attr("transform", d3.event.transform);
            node.attr("transform", d3.event.transform);
        }
        
    }

    onGenerateSubgraph = () => {
      this.props.dispatch(generateSubgraph({
        markers: this.state.markers
      }))
    }

    render() {
        return (
            <div
                tabIndex={'0'}
                onKeyDown={(e) => {
                    if (e.shiftKey) {
                        this.toggleLasso(true);
                    }
                }}
                onKeyUp={(e) => {
                    if (!e.shiftKey) {
                        this.toggleLasso(false);
                    }
                }}
                style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    width: 1900, // 1920 - 20
                }}
            >
                <Header title="NODE-LINK VIEW" />
                <div className='container'>
                    <svg ref={this.svgRef}></svg>
                    {
                        // upload&download button
                        <div style={{
                            position: "absolute",
                            top: 20,
                            left: 20
                        }}>
                            <Button
                                shape='circle'
                                icon='upload'
                                size='large'
                                style={{
                                    marginRight: 5,
                                }}
                            />
                            <Button
                                shape='circle'
                                icon='download'
                                size='large'
                            />
                            <Button
                              onClick={this.onGenerateSubgraph}
                            >Get Exemplar</Button>
                        </div>
                    }
                    {
                        // Data information
                        this.props.graph &&
                        <div style={{
                            position: 'absolute',
                            bottom: 20,
                            right: 20,
                            fontSize: 18,
                        }}>
                            <span>dataset: {this.props.name}</span>
                            <br />
                            <span>#node: {this.props.graph.nodes.length}</span>
                            <br />
                            <span>#link: {this.props.graph.links.length}</span>
                        </div>
                    }
                    {
                        // Lasso switcher
                        <Switch
                            style={{
                                position: 'absolute',
                                top: 20,
                                right: 20,
                            }}
                            checkedChildren="exemplar"
                            unCheckedChildren="sketcher"
                            checked={this.props.lassoType === 'source'}
                            onChange={(checked) => {
                                this.props.dispatch(switchLassoType(checked))
                            }}
                        />
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
      ...state.wholeGraph,
      subGraph: state.subGraph.data
    }
}

export default connect(mapStateToProps)(WholeGraph)