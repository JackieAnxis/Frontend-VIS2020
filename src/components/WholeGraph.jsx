import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import { requestWholeGraph } from '../actions/wholeGraph'
import { GraphTransformer } from '../utils/vis'

const configs = {
    width: 1920,
    height: 1080,
    bgColor: 'rgba(238, 238, 238, 1)',
    node: {
        color: 'rgba(36, 144, 200, 0.5)'
    },
    link: {
        color: 'rgba(153, 153, 153, 0.1)'
    },
    padding: 20,
}

class WholeGraph extends React.Component {
    componentDidMount() {
        this.props.dispatch(requestWholeGraph())
        this.svgRef = React.createRef()
    }
    componentDidUpdate() {
        this.draw();
    }

    draw = () => {
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
            .attr("r", 5)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr("fill", configs.node.color)
    }

    render() {
        return (
            <div>
                <svg ref={this.svgRef}></svg>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return state.wholeGraph
}

export default connect(mapStateToProps)(WholeGraph)