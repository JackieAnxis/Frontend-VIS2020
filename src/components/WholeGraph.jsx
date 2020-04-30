import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import { lasso as d3Lasso } from 'd3-lasso'
import { requestWholeGraph } from '../actions/wholeGraph'
import { generateSubgraph } from '../actions/subGraph'
import { GraphTransformer, getGraphCenter } from '../utils/vis'
import Header from './Header'
import Exemplar from './Exemplar/Exemplar'
import HistoryPanel from './HistoryPanel/HistoryPanel'
import { Button, Switch } from 'antd'
import './common.css'
import './lasso.css'
import { applyDeformationToWholegraph } from '../actions/deformation'
import { setLassoResult, switchLassoType } from '../actions/wholeGraph'
import { nodeLinkG } from '../old-vis'

window.d3 = d3 // NOTE: d3-lasso need global d3, f**k

const configs = {
    width: 1900, // 1920 - 20
    height: 1020, // 1080 - 40 - 20
    // bgColor: 'rgba(238, 238, 238, 1)',
    bgColor: '#ffffff',
    node: {
        // color: 'rgba(36, 144, 200, 0.5)',
        color: 'rgba(190, 200, 200, 1)',
        r: 5,
        // border: 1.5,
        border: 0,
    },
    link: {
        // color: 'rgba(153, 153, 153, 0.1)',
        color: 'rgba(190, 200, 200, 1)',
        width: 1.5,
    },
    padding: 20,
}

class WholeGraph extends React.Component {
    constructor(props) {
        super(props);
        this.svgRef = React.createRef();
        this.lasso = null;
        this.zoom = null;
        this.transformer = null;
        this.zoomTransform = { k: 1, x: 0, y: 0 };
        this.state = {
            markers: [],
            graphName: ''
        }
    }
    componentDidMount() {
        this.props.dispatch(requestWholeGraph())
    }
    componentDidUpdate(prevProps) {
        if (this.props.name !== this.state.graphName || this.props.graphState !== prevProps.graphState) {
            // if (this.props.name !== this.state.graphName) {
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
            // let subGraph = nextProps.subGraph;
            const svg = d3.select(this.svgRef.current);
            // if (subGraph && 'nodes' in subGraph) {
            //     for (const node of subGraph.nodes) {
            //         svg.select(`#node-${node.id}`).classed('selected', true)
            //     }
            //     for (const link of subGraph.links) {
            //         svg.select(`#link-${link.source}-${link.target}`).classed('selected', true)
            //     }
            // }
            if (nextProps.viewCenter && nextProps.viewCenter !== this.props.viewCenter) {
                // to modify
                const center = this.transformer.transformPos(getGraphCenter(nextProps.viewCenter));
                this.zoom.duration(750).translateTo(svg.transition().duration(500), center.x, center.y);

                svg.select('#nodes').selectAll('circle.selected').classed('selected', false).attr('r', 5);
                svg.select('#nodes').selectAll('circle.selected-target').classed('selected-target', false);
                svg.select('#links').selectAll('line.selected').classed('selected', false);
                svg.select('#links').selectAll('line.selected-target').classed('selected-target', false);

                let type = JSON.stringify(nextProps.viewCenter) === JSON.stringify(this.props.graphsInfo.source.sourceOrigin) ? 'selected' : 'selected-target';

                for (const node of nextProps.viewCenter.nodes) {
                    svg.select(`#node-${node.id}`).classed(type, true)
                }
                for (const link of nextProps.viewCenter.links) {
                    // svg.select(`#link-${link.source}-${link.target}`).classed('selected', true)
                    svg.select(`#link-${link.source}-${link.target}`).classed(type, true)
                }
            }
        }
    }

    toggleLasso = (enable) => {
        window.g.toggleLasso(enable)

        const svg = d3.select(this.svgRef.current);
        if (enable) {
            svg.on('.zoom', null);
            svg.call(this.lasso);
        } else {
            svg.call(this.zoom).on('dblclick.zoom', null);
            svg.on('.dragstart', null);
            svg.on('.drag', null);
            svg.on('.dragend', null);
        }
    }

    draw = () => {

        let _this = this;
        if (!this.props.graph || !this.props.graph.nodes) {
            return;
        }
        this.transformer = GraphTransformer(this.props.graph, configs.width, configs.height, configs.padding);
        const visData = this.transformer.transform();
        const nodes = visData.nodes;
        const links = visData.links;
        const nodeMap = {};
        for (const n of nodes) {
            nodeMap[n.id] = n;
        }

        // use WebGL draw
        const canvas = document.querySelector('#whole-graph-g')
        const lassoCallback = (nodes) => {
            console.log(nodes)
        }
        nodeLinkG(canvas, visData, lassoCallback)


        const svg = d3.select(this.svgRef.current);
        svg.selectAll('*').remove();
        svg
            .attr('width', configs.width)
            .attr('height', configs.height)
            .style('background', configs.bgColor)
            .attr('viewBox', [0, 0, configs.width, configs.height]);

        const link = svg.append("g")
            .attr("stroke", configs.link.color)
            .attr('id', 'links')
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", configs.link.width)
            .attr("x1", d => nodeMap[d.source].x)
            .attr("y1", d => nodeMap[d.source].y)
            .attr("x2", d => nodeMap[d.target].x)
            .attr("y2", d => nodeMap[d.target].y)
            .attr("id", d => `link-${d.source}-${d.target}`)

        const node = svg.append("g")
            .attr('id', 'nodes')
            .attr("stroke", "#fff")
            .attr("stroke-width", configs.node.border)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", configs.node.r)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr("fill", configs.node.color)
            .attr("id", d => `node-${d.id}`)
            .on("dblclick", cancelAll)
            .on("click", clickMarker)

        function clickMarker(node) {
            d3.event.stopPropagation();
            let target = d3.event.target;
            const nodeId = node.id;
            let markers = _this.state.markers;
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

        function cancelAll() {
            if (_this.props.subGraph) {
                for (const node of _this.props.subGraph.nodes) {
                    svg.select(`#node-${node.id}`).classed('selected', false);
                }
                for (const link of _this.props.subGraph.links) {
                    svg.select(`#link-${link.source}-${link.target}`).classed('selected', false)
                }
            } else {
                for (const nodeid of _this.state.markers) {
                    svg.select(`#node-${nodeid}`).classed('selected', false);
                }
            }
            _this.setState({
                markers: []
            })
        }

        const lasso_start = function () {
            this.lasso.items()
                // .attr("r", 7)
                .classed("not_possible", true)
                .classed("selected", false);
        };

        const lasso_draw = function () {
            const nodePossibleType = this.props.lassoType == 'source' ? 'possible' : 'possible-target';
            this.lasso.possibleItems()
                .classed("not_possible", false)
                .classed(nodePossibleType, true);
            this.lasso.notPossibleItems()
                .classed("not_possible", true)
                .classed(nodePossibleType, false);
        };

        const lasso_end = function () {
            svg.select('#nodes').selectAll('circle.selected-target').classed('selected', false);
            svg.select('#nodes').selectAll('circle.selected-target').classed('selected-target', false);
            svg.select('#links').selectAll('line.selected').classed('selected', false);
            svg.select('#links').selectAll('line.selected-target').classed('selected-target', false);

            const nodeSelectedType = this.props.lassoType == 'source' ? 'selected' : 'selected-target';
            const nodePossibleType = this.props.lassoType == 'source' ? 'possible' : 'possible-target';

            this.lasso.items()
                .classed("not_possible", false)
                .classed(nodePossibleType, false);
            this.lasso.selectedItems()
                .classed(nodeSelectedType, true)
                .attr("r", 7 / this.zoomTransform.k);
            this.lasso.notSelectedItems()
                .attr("r", configs.node.r / this.zoomTransform.k);

            const nodes = this.lasso.selectedItems().data();
            const selectedGraph = getGraphFromNodes(nodes);

            for (const link of selectedGraph.links) {
                svg.select(`#link-${link.source}-${link.target}`).classed(nodeSelectedType, true)
            }

            if (nodes.length) {
                this.props.dispatch(setLassoResult(selectedGraph, this.props.lassoType));
            }
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
            .on("zoom", zoomed.bind(this));

        svg.call(this.zoom).on('dblclick.zoom', null);
        // zoom
        function zoomed() {
            this.zoomTransform = d3.event.transform;
            link.attr("transform", this.zoomTransform);
            node.attr("transform", this.zoomTransform);
            node.attr('r', configs.node.r / this.zoomTransform.k);
            node.attr('stroke-width', configs.node.border / this.zoomTransform.k);
            link.attr('stroke-width', configs.link.width / this.zoomTransform.k);
        }

        function getGraphFromNodes(nodes) {
            const nodesId = nodes.map(d => d.id);
            const nodesIdSet = new Set(nodesId);
            const allLinks = _this.props.graph.links;
            // bruce-force
            const links = [];
            for (const link of allLinks) {
                if (nodesId.indexOf(link.target) > -1 && nodesId.indexOf(link.source) > -1)
                    links.push({
                        source: link.source,
                        target: link.target,
                    })
            }

            const res = {
                nodes: _this.props.graph.nodes.filter((n) => nodesIdSet.has(n.id)),
                links: links
            }

            return res;
        }

        function getLinkFromNodes(nodes) {
            const allLinks = _this.props.graph.links;
            // bruce-force
            const links = [];
            const nodesId = nodes.map(d => d.id);
            for (const link of allLinks) {
                if (nodesId.indexOf(link.target) > -1 && nodesId.indexOf(link.source) > -1)
                    links.push({
                        source: link.source,
                        target: link.target,
                    })
            }
            // for (let outerIndex = 0; outerIndex < nodes.length - 1; outerIndex++) {
            //     const outerNode = nodes[outerIndex];
            //     for (let innerIndex = outerIndex; innerIndex < nodes.length; innerIndex++) {
            //         const innerNode = nodes[innerIndex];
            //         if (outerNode.id !== innerNode.id) {
            //             const link = g.getLinkByEnd(outerNode.id, innerNode.id);
            //             if (link) {
            //                 links.push({
            //                     source: link.source.id,
            //                     target: link.target.id,
            //                 });
            //             }
            //         }
            //     }
            // }
            return links;
        }

    }

    onGenerateSubgraph = () => {
        this.props.dispatch(generateSubgraph({
            markers: this.state.markers
        }))
    }

    onDraggedSource = (data) => {
        // dispatch(setSourceModified(data))
    }

    // 应用到大图上
    onApplyDeformation = () => {
        const { target } = this.props.graphsInfo;
        // const keys = Object.keys(target);
        let deformedTargetGraph = [];
        for (let key in target) {
            if (target[key].targetGenerated) {
                deformedTargetGraph.push(target[key].targetGenerated)
            }
        }
        if (!deformedTargetGraph.length) {
            alert("No deformed subgraphs yet!")
        } else {
            this.props.dispatch(applyDeformationToWholegraph({
                wholeGraphData: this.props.graph,
                deformedTargetGraph: deformedTargetGraph
            }))
        }
    }

    render() {
        const { source, target } = this.props.graphsInfo;
        const showExemplar = !!this.props.graphsInfo.source.sourceOrigin;
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
                <Header
                    style={{
                        width: showExemplar ? 1590 : 1900,
                        left: showExemplar ? 310 : 0,
                        transition: 'left 0.8s, width 0.8s'
                    }}
                    title="NODE-LINK VIEW"
                />
                <HistoryPanel />
                <div className='container'>
                    <div style={{
                        position: "relative",
                        width: 1900,
                        height: 1020,
                        overflow: 'hidden'
                    }}>
                        <canvas id='whole-graph-g'></canvas>
                    </div>
                    {/* <svg ref={this.svgRef}></svg> */}
                    {
                        // upload&download button
                        <div style={{
                            position: "absolute",
                            top: 20,
                            left: 20
                        }}>
                            {/* <Button
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
                            /> */}
                            {/* 临时的按钮 */}
                            {/* <Button
                                onClick={this.onGenerateSubgraph}
                            >Get Exemplar</Button> */}
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
                            <span>Dataset: {this.props.name}</span>
                            <br />
                            <span>#node: {this.props.graph.nodes.length}</span>
                            <br />
                            <span>#link: {this.props.graph.links.length}</span>
                        </div>
                    }

                    <Switch
                        style={{
                            position: 'absolute',
                            top: 20,
                            right: 20,
                        }}
                        checkedChildren="source"
                        unCheckedChildren="target"
                        checked={this.props.lassoType === 'source'}
                        onChange={(checked) => {
                            this.props.dispatch(switchLassoType(checked))
                        }}
                    />
                    <Button
                        style={{
                            position: 'absolute',
                            top: 50,
                            right: 20,
                            width: 75,
                            height: 25
                        }}
                        type="primary"
                        onClick={this.onApplyDeformation}>
                        FUSE
                        </Button>

                </div>
                {/* {
                    // TODO: show only for debug, can safely deleted
                    this.props.graphsInfo.targetGenerated &&
                    this.props.graph &&
                    <div style={{
                        position: "absolute",
                        right: 40,
                        top: 200,
                        width: 300,
                        height: 300,
                        border: '1px solid',
                    }}>
                        <GraphD3
                            data={this.props.graphsInfo.targetGenerated}
                            width={300}
                            height={300}
                            padding={20}
                            autoLayout={false}
                            id={'target_generated'}
                        />
                    </div>
                } */}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        ...state.wholeGraph,
        subGraph: state.subGraph,
        graphsInfo: state.graphs, // NOTE: redundant, for convenience of draw differenct graph
    }
}

export default connect(mapStateToProps)(WholeGraph)