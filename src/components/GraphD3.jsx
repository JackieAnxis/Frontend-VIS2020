import * as d3 from 'd3';
import { GraphTransformer } from '../vis';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setDeformationMarker, setDeformationGraph } from '../actions/deformation'

function GraphD3(props) {
  const { dispatch, data, width, height, padding, id, autoLayout, deformFlag, saveModify, onDragged, onClickNode, markers } = props;
  const [curGraphData, setCurGraphData] = useState();
  const svgRef = React.createRef();

  const draw = () => {
    setCurGraphData(null);
    const transformer = GraphTransformer(data, width, height, padding);
    const visData = transformer.transform();
    const nodes = visData.nodes;
    const links = visData.links;
    const nodeMap = {};
    for (const n of nodes) {
      nodeMap[n.id] = n;
    }

    // 计算每个点到其余点的平均距离(用归一化之后的坐标) 并把Nodes按距离由大到小排序
    const nodesNum = nodes.length;
    for (const targetIndex in nodes) {
      let dist = 0;
      for (const restIndex in nodes) {
        if (targetIndex === restIndex) continue;
        dist += getDistBetween2Nodes(nodes[targetIndex], nodes[restIndex])
      }
      nodes[targetIndex].distNorm = dist / (nodesNum - 1);
      nodes[targetIndex].distNormWithLinks = 0; // 初始化
      nodes[targetIndex].linksNum = 0; // 初始化
    }

    // 计算每个点到另外所有跟该点有连线的点的平均距离
    for (const { source, target } of links) {
      let dist = getDistBetween2Nodes(nodeMap[source], nodeMap[target]);
      // console.log(dist, source, target)
      nodeMap[source].distNormWithLinks += dist;
      nodeMap[target].distNormWithLinks += dist;
      nodeMap[source].linksNum++;
      nodeMap[target].linksNum++;
    }

    nodes.forEach(n => {
      n.distNormWithLinks /= n.linksNum;
    })
    nodes.sort(sortBy("distNorm"));
    function getDistBetween2Nodes(node1, node2) {
      return Math.sqrt(Math.pow(node1.normX - node2.normX, 2) + Math.pow(node1.normY - node2.normY, 2));
    }

    // 由大到小排序
    function sortBy(param) {
      return function (node1, node2) {
        return node2[param] - node1[param];
      }
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*')
      .remove();
    svg.attr("viewBox", [0, 0, width, height])
      .attr("width", width);

    // TODO: link draw
    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 3)
      .attr("x1", d => nodeMap[d.source].x)
      .attr("y1", d => nodeMap[d.source].y)
      .attr("x2", d => nodeMap[d.target].x)
      .attr("y2", d => nodeMap[d.target].y);

    const colors = ["#A52A2A", "#FF8C00", "#FFD700"];
    let labels; // TODO: delare labels
    const node = svg.append("g")
      .attr('id', 'nodes')
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      // .attr("r", (d, i) => (i < 3) ? 8:5)
      .attr("r", 5)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      // .attr("fill", (d, i) => (i < 3) ? colors[i]:'#aaa')
      .attr("fill", '#aaa')
      .on('mousedown', function (d) {
        if (onClickNode) {
          onClickNode(parseInt(d.id))
          labels
            .append('text')
            .attr('text-anchor', 'middle')
            // .attr('fill', '#E65C49')
            .attr('fill', '#ffffff')
            .style('font-size', 20)
            .attr('transform', `translate(${d3.select(this).attr('cx')}, ${7 + Number(d3.select(this).attr('cy'))})`)
            .text('' + (markers.length))
          d3.select(this)
            .attr('fill', '#E65C49')
            .attr('r', 15)
        }
      })

    labels = svg.append('g').attr('id', 'labels'); // draw labels above nodes
    // suggestion和history默认不能drag和zoom
    if (id.indexOf("modified") > -1) {
      // console.log("进来了")
      node.call(d3.drag()
        .on('start', dragStart)
        .on('drag', dragged)
        .on('end', dragEnd));
      svg.call(d3.zoom()
        .extent([
          [0, 0],
          [width, height]
        ])
        .scaleExtent([1, 8])
        .on("zoom", zoomed));
    }

    let transform = d3.zoomIdentity; // transform for zoom&pan&drag
    function zoomed() {
      transform = d3.event.transform;
      node.attr("transform", d3.event.transform);
      link.attr("transform", d3.event.transform);
    }

    function dragStart() {
      d3.select(this).raise();
    }

    function dragged(d) {
      d.x = d3.event.x;
      d.y = d3.event.y;
      d3.select(this).attr("cx", d.x).attr("cy", d.y);
      link.filter(function (l) { return l.source === d.id; }).attr("x1", d.x).attr("y1", d.y);
      link.filter(function (l) { return l.target === d.id; }).attr("x2", d.x).attr("y2", d.y);
    }

    function dragEnd() {
      const exemplarAfterTrans = transformer.detransform(visData);
      // dispatch(setDeformationGraph(exemplarAfterTrans));
      setCurGraphData(exemplarAfterTrans);
      if (onDragged) {
        onDragged(exemplarAfterTrans);
      }
    }

    // const exemplarMarker = [parseInt(nodes[0].id), parseInt(nodes[1].id), parseInt(nodes[2].id)];
    // 应用deform之后不用再重新算对应的点
    if (!deformFlag && (id == "source" || id == "target")){
      let marker = {};
      marker[id] = [parseInt(nodes[0].id), parseInt(nodes[1].id), parseInt(nodes[2].id)]
      dispatch(setDeformationMarker(marker));
    }
  }

  const clearMarkers = () => {
    const svg = d3.select(svgRef.current);
    svg.select('#labels').selectAll('*').remove();
    svg.select('#nodes').selectAll('circle')
      .attr('fill', '#aaa')
      .attr('r', 5)
  }

  const drawForce = () => {
    const visData = data;
    const links = JSON.parse(JSON.stringify(visData.links))//visData.links.map(d => JSON.parse(JSON.stringify(d)));
    const nodes = JSON.parse(JSON.stringify(visData.nodes))//visData.nodes.map(d => JSON.parse(JSON.stringify(d)));

    const nodeMap = {};
    for (const n of nodes) {
      nodeMap[n.id] = n;
    }

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).distance(100).id(d => d.id))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const svg = d3.select(svgRef.current);
    svg.selectAll('*')
      .remove();
    svg.attr("viewBox", [0, 0, width, height]);

    // TODO: link draw
    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 3)
    // .attr("x1", d => nodeMap[d.source.id].x)
    // .attr("y1", d => nodeMap[d.source.id].y)
    // .attr("x2", d => nodeMap[d.target.id].x)
    // .attr("y2", d => nodeMap[d.target.id].y);

    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 5)
      .attr("id", d => d.id)
      // .attr('cx', d => d.x)
      // .attr('cy', d => d.y)
      .attr("fill", '#aaa')
      .call(d3.drag()
        .on('start', dragStart)
        .on('drag', dragged)
        .on('end', dragEnd));
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    });

    svg.call(d3.zoom()
      .extent([
        [0, 0],
        [width, height]
      ])
      .scaleExtent([1, 8])
      .on("zoom", zoomed));

    let transform = d3.zoomIdentity; // transform for zoom&pan&drag
    function zoomed() {
      transform = d3.event.transform;
      node.attr("transform", d3.event.transform);
      link.attr("transform", d3.event.transform);
    }

    function dragStart() {
      d3.select(this).raise();
    }

    function dragged(d) {
      d.x = d3.event.x;
      d.y = d3.event.y;
      d3.select(this).attr("cx", d.x).attr("cy", d.y);
      // d3.select(this).attr("fx", d.x).attr("fy", d.y);
      link.filter(function (l) { return l.source === d; }).attr("x1", d.x).attr("y1", d.y);
      link.filter(function (l) { return l.target === d; }).attr("x2", d.x).attr("y2", d.y);
    }
    function dragEnd() {
      const newData = { "nodes": JSON.parse(JSON.stringify(nodes)), "links": visData.links };
      setCurGraphData(newData);
      if (onDragged) {
        onDragged(newData);
      }
    }
    setCurGraphData({ "nodes": nodes, "links": visData.links })
  }

  useEffect(() => {
    console.log(data)
    if (data && "nodes" in data && data.nodes.length && !autoLayout) {
      draw();
    }
  }, [data])

  useEffect(() => {
    if (autoLayout) {
      drawForce();
    }
  }, [autoLayout])

  useEffect(() => {
    if (curGraphData)
      dispatch(setDeformationGraph({
        prev: data,
        cur: curGraphData
      }));// 还要保存一次记录在history里
  }, [saveModify])

  useEffect(() => {
    if (markers && markers.length === 0) {
      clearMarkers();
    }
  }, [markers])

  return (
    <svg ref={svgRef}></svg>
  );

  // return [parseInt(nodes[0].id), parseInt(nodes[1].id), parseInt(nodes[2].id)];
}

export default connect()(GraphD3);
