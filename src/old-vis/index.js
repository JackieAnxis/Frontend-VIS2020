import * as d3 from 'd3';

import { nodeLink, nodeLinkG, updateNodeLinkG } from './nodeLink'
import { exemplar, exemplarForce } from './exemplar'


function GraphTransformer(data, width, height, padding) {
    if (!data)
        return null;

    const minX = Math.min(...data.nodes.map(n => n.x));
    const maxX = Math.max(...data.nodes.map(n => n.x));
    const minY = Math.min(...data.nodes.map(n => n.y));
    const maxY = Math.max(...data.nodes.map(n => n.y));

    return {
        transform,
        detransform,
    }

    function transform() {
        // TODO: not elegant, manual transform, use d3 transform instead?
        const transformX = val => {
            return ((val - minX) / (maxX - minX)) * (width - padding * 2) + padding;
        };
        const transformY = val => {
            return ((val - minY) / (maxY - minY)) * (height - padding * 2) + padding;
        };
        const transformNormX = val => {
            return ((val - minX) / (maxX - minX));
        };
        const transformNormY = val => {
            return ((val - minY) / (maxY - minY));
        };

        const res = JSON.parse(JSON.stringify(data));

        res.nodes.forEach(n => {
            n.normX = transformNormX(n.x);// 归一化后的坐标
            n.normY = transformNormY(n.y);
            n.x = transformX(n.x);
            n.y = transformY(n.y);
        });

        return res;
    }

    function detransform(data) {
        // TODO: not elegant, manual transform, use d3 transform instead?
        const transformX = val => {
            return (val - padding) / (width - padding * 2) * (maxX - minX) + minX;
        };
        const transformY = val => {
            return (val - padding) / (height - padding * 2) * (maxY - minY) + minY;
        };

        const res = JSON.parse(JSON.stringify(data));

        res.nodes.forEach(n => {
            n.x = transformX(n.x);
            n.y = transformY(n.y);
        });

        return res;
    }
}

function transformGraphData(data, width, height, padding) {
    if (!data)
        return null;
    const minX = Math.min(...data.nodes.map(n => n.x));
    const maxX = Math.max(...data.nodes.map(n => n.x));
    const minY = Math.min(...data.nodes.map(n => n.y));
    const maxY = Math.max(...data.nodes.map(n => n.y));

    // TODO: not elegant, manual transform, use d3 transform instead?
    const transformX = val => {
        return ((val - minX) / (maxX - minX)) * (width - padding * 2) + padding;
    };
    const transformY = val => {
        return ((val - minY) / (maxY - minY)) * (height - padding * 2) + padding;
    };

    const res = JSON.parse(JSON.stringify(data));

    res.nodes.forEach(n => {
        n.x = transformX(n.x);
        n.y = transformY(n.y);
    });

    return res;
}

function detransformGraphData(data) {
    if (!data) return null;
}

function graph(div, data, width, height, padding, onDragged) {
    if (!data) return;

    const transformer = new GraphTransformer(data, width, height, padding);
    const visData = transformer.transform();

    d3.select(div)
        .selectAll('svg')
        .remove();
    const svg = d3
        .select(div)
        .append('svg')
        .style('border', '1px solid')
        // .attr('viewBox', [0, 0, width, height])
        .attr('width', width)
        .attr('height', height);

    const nodes = svg
        .append('g')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .selectAll('circle')
        .data(visData.nodes)
        .join('circle')
        .attr('r', 10)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('fill', '#aaa')
        .call(d3.drag().on('drag', dragged));

    const links = svg
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(visData.links)
        .join('line')
        .attr('x1', d => visData.nodes[d.source].x)
        .attr('y1', d => visData.nodes[d.source].y)
        .attr('x2', d => visData.nodes[d.target].x)
        .attr('y2', d => visData.nodes[d.target].y)
        .attr('stroke-width', d => 2);

    function dragged(d) {
        d.x = d3.event.x;
        d.y = d3.event.y;
        d3.select(this).attr("cx", d.x).attr("cy", d.y);
        links.filter(function (l) { return l.source === d.id; }).attr("x1", d.x).attr("y1", d.y);
        links.filter(function (l) { return l.target === d.id; }).attr("x2", d.x).attr("y2", d.y);

        onDragged(transformer.detransform(visData));
    }

    return {
        getData: function () {
            return transformer.detransform(visData);
        }
    }
}

export {
    nodeLink,
    nodeLinkG,
    updateNodeLinkG,
    exemplar,
    exemplarForce,
    graph,
    transformGraphData,
    detransformGraphData,
    GraphTransformer
};