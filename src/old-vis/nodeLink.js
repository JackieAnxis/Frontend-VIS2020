import * as d3 from 'd3';
import { defalutStyle } from '../configs';

const width = 1900;
const height = 1020;

const clusterColors = [
    "#3957ff", "#d3fe14", "#c9080a", "#fec7f8", "#0b7b3e",
    "#0bf0e9", "#c203c8", "#fd9b39", "#888593", "#906407",
    "#98ba7f", "#fe6794", "#10b0ff", "#ac7bff", "#fee7c0",
    "#964c63", "#1da49c", "#0ad811", "#bbd9fd", "#fe6cfe",
    "#297192", "#d1a09c", "#78579e", "#81ffad", "#739400",
    "#ca6949", "#d9bf01", "#646a58", "#d5097e", "#bb73a9",
    "#ccf6e9", "#9cb4b6", "#b6a7d4", "#9e8c62", "#6e83c8",
    "#01af64", "#a71afd", "#cfe589", "#d4ccd1", "#fd4109",
    "#bf8f0e", "#2f786e", "#4ed1a5", "#d8bb7d", "#a54509",
    "#6a9276", "#a4777a", "#fc12c9", "#606f15", "#3cc4d9",
    "#f31c4e", "#73616f", "#f097c6", "#fc8772", "#92a6fe",
    "#875b44", "#699ab3", "#94bc19", "#7d5bf0", "#d24dfe",
    "#c85b74", "#68ff57", "#b62347", "#994b91", "#646b8c",
    "#977ab4", "#d694fd", "#c4d5b5", "#fdc4bd", "#1cae05",
    "#7bd972", "#e9700a", "#d08f5d", "#8bb9e1", "#eac0b1",
    "#9ce96c", "#fed46d", "#f1e106", "#96409b", "#5d6a6c",
    "#915533", "#8756a0", "#826170", "#6d6c64", "#a35123",
    "#0e7d93", "#6d6d83", "#9c5660", "#3f8000", "#4f61ff",
    "#097cb0", "#4c779a", "#a54d89", "#c12876", "#a45751",
    "#af4f2f", "#73776c", "#db0118", "#6c834f", "#0685df",
    "#8668df", "#028daa", "#a164a6", "#6a8193", "#4c7aff",
    "#d23699", "#93758a", "#d14856", "#c55c05", "#9172c2",
    "#b0659a", "#858367", "#a8753a", "#0c90d9", "#93816e",
    "#6d914b", "#c53cfe", "#668eaa", "#d05198", "#5d9481",
    "#c3666c", "#3a9d5f", "#f61236", "#b76bb2", "#9a884d",
    "#4ea456", "#45a634", "#b4841a", "#cf5ae2", "#a58895",
    "#92918e", "#869d02", "#b572f6", "#7e99ab", "#a285e5",
    "#e553d6", "#d867c1", "#33af78", "#a89275", "#b382df",
    "#5faa90", "#f06082", "#cf7e82", "#7ea695", "#8fa2ca",
    "#ca8d9f", "#e47c90", "#5cb5b3", "#07bea3", "#c099b5",
    "#96ad9b", "#a3a0fa", "#a0b33f", "#c496f7", "#07c99d",
    "#e7945b", "#83b9d2", "#0ad13c", "#7dc513", "#baabec",
    "#e992e4", "#18cfc7", "#b0b6d7", "#c2b1c6", "#ef9ab1"];

// TODO: not elegant, but work
const lassoItems = new Set()
function cleanLassoSelection(g) {
    for (const id of lassoItems) {
        const node = g.getNodeById(id);
        node.fill = defalutStyle.wholeGraph.node.fill;
        node.strokeWidth = defalutStyle.wholeGraph.node.strokeWidth;
        node.r = defalutStyle.wholeGraph.node.r;
        node.strokeColor = defalutStyle.wholeGraph.node.strokeColor;
    }

    lassoItems.clear();
}

function getLinkFromNodes(g, nodes) {
    // bruce-force
    const links = [];
    for (let outerIndex = 0; outerIndex < nodes.length - 1; outerIndex++) {
        const outerNode = nodes[outerIndex];
        for (let innerIndex = outerIndex; innerIndex < nodes.length; innerIndex++) {
            const innerNode = nodes[innerIndex];
            if (outerNode.id !== innerNode.id) {
                const link = g.getLinkByEnd(outerNode.id, innerNode.id);
                if (link) {
                    links.push({
                        source: link.source.id,
                        target: link.target.id,
                    });
                }
            }
        }
    }

    return links;
}

function color2rgb(str) {
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 把颜色值变成小写
    let color = str.toLowerCase();
    if (reg.test(color)) {
        // 如果只有三位的值，需变成六位，如：#fff => #ffffff
        if (color.length === 4) {
            let colorNew = "#";
            for (let i = 1; i < 4; i += 1) {
                colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
            }
            color = colorNew;
        }
        // 处理六位的颜色值，转为RGB
        let colorChange = [];
        for (let i = 1; i < 7; i += 2) {
            colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
        }
        return {
            r: colorChange[0] / 255,
            g: colorChange[1] / 255,
            b: colorChange[2] / 255,
            a: 1
        }
        // "RGB(" + colorChange.join(",") + ")";
    } else {
        return color;
    }
}

export function nodeLink(div, data) {
    if (!data) {
        return;
    }
    console.log('drawing...')
    const links = data.links.map(d => Object.create(d));
    const nodes = data.nodes.map(d => Object.create(d));

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    const svg = d3.select(div).append("svg")
        .attr("viewBox", [0, 0, width, height]);

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 10)
        .attr("fill", '#aaa');

    node.append("title")
        .text(d => d.id);

    /*
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
*/

    svg.call(d3.zoom()
        .extent([[0, 0], [width, height]])
        .scaleExtent([1, 8])
        .on("zoom", zoomed));

    function zoomed() {
        node.attr("transform", d3.event.transform);
        link.attr("transform", d3.event.transform);
    }

    simulation.on("end", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });
}

export function updateNodeLinkG(g, data) {
    var nodes = data.nodes;
    var edges = data.links;

    const hasPosition = data.hasPosition !== undefined ?
        data.hasPosition :
        data.nodes && data.nodes[0].x ? true : false;

    console.log(hasPosition);

    var name2index = new Map();
    let ii = 0;
    let totalTime = 0;
    let drawer = g.drawer;

    console.log(nodes.length, edges.length);

    for (var i = 0; i < data.nodes.length; i++) {
        name2index.set(data.nodes[i].id, i);
        data.nodes[i].id = i;
        data.nodes[i].renderID = i;
        data.nodes[i].fill = {
            r: 36 / 255,
            g: 144 / 255,
            b: 200 / 255,
            a: 0.5,
        };
        // data.nodes[i].fill = (cluster[i] === -1) ?
        // {
        //   r: 0 / 255,
        //   g: 0 / 255,
        //   b: 0 / 255,
        //   a: 0.1,
        // } : color2rgb(clusterColors[cluster[i]]);

        data.nodes[i].strokeWidth = 1;
        data.nodes[i].r = 5;
        data.nodes[i].strokeColor = {
            r: 200 / 255,
            g: 36 / 255,
            b: 144 / 255,
            a: 0.1,
        };
        if (!hasPosition) {
            console.log('random set position')
            data.nodes[i].x = Math.random() * width;
            data.nodes[i].y = Math.random() * height;
        }
    }

    for (var i = 0; i < data.links.length; i++) {
        data.links[i].renderID = 1000 + i; // TODO: test render id
        data.links[i].source = name2index.get(data.links[i].source);
        data.links[i].target = name2index.get(data.links[i].target);
        data.links[i].strokeWidth = 3;
        data.links[i].strokeColor = {
            r: 153 / 255,
            g: 153 / 255,
            b: 153 / 255,
            a: 0.1,
        };
    }

    g.data(data);
    g.refresh();
}

export function nodeLinkG(canvas, data, onLassoCallback, cluster = null) {
    // const canvas = div.appendChild(document.createElement('canvas'));
    d3.select(canvas).attr('width', width).attr('height', height).style('position', 'absolute');
    // NOTE: export to global
    const g = new window.G({
        background: defalutStyle.wholeGraph.bgColor,
        clearColor: defalutStyle.wholeGraph.bgColor,
    });
    window.g = g;

    var nodes = data.nodes;
    var edges = data.links;

    const hasPosition = data.hasPosition !== undefined ?
        data.hasPosition :
        data.nodes && data.nodes[0].x ? true : false;

    console.log(hasPosition);

    var name2index = new Map();
    let ii = 0;
    let totalTime = 0;
    let drawer = g.drawer;

    console.log(nodes.length, edges.length);

    for (var i = 0; i < data.nodes.length; i++) {
        name2index.set(data.nodes[i].id, i);
        data.nodes[i].id = i;
        data.nodes[i].renderID = i;
        data.nodes[i].fill = {
            r: 36 / 255,
            g: 144 / 255,
            b: 200 / 255,
            a: 0.5,
        };
        // data.nodes[i].fill = (cluster[i] === -1) ?
        // {
        //   r: 0 / 255,
        //   g: 0 / 255,
        //   b: 0 / 255,
        //   a: 0.1,
        // } : color2rgb(clusterColors[cluster[i]]);

        data.nodes[i].strokeWidth = 1;
        data.nodes[i].r = 5;
        data.nodes[i].strokeColor = {
            r: 200 / 255,
            g: 36 / 255,
            b: 144 / 255,
            a: 0.1,
        };
        if (!hasPosition) {
            console.log('random set position')
            data.nodes[i].x = Math.random() * width;
            data.nodes[i].y = Math.random() * height;
        }
    }

    for (var i = 0; i < data.links.length; i++) {
        data.links[i].renderID = 1000 + i; // TODO: test render id
        data.links[i].source = name2index.get(data.links[i].source);
        data.links[i].target = name2index.get(data.links[i].target);
        data.links[i].strokeWidth = 3;
        data.links[i].strokeColor = {
            r: 153 / 255,
            g: 153 / 255,
            b: 153 / 255,
            a: 0.1,
        };
    }

    g.container(canvas);
    g.data(data);

    g.on('zoom', function () { })
    g.on('pan', function () { })

    g.nodes().forEach(node => {
        node.on('mousedown', (ev) => { console.log('Node picked: ', ev) })
        // node.on('drag', console.log)
    })
    const linkClickHandler = (event) => {
        console.log(event)
        const link = event.target
        link.strokeColor = {
            r: 1,
            g: 0,
            b: 0,
            a: 0.1,
        };
        g.refresh();
    }
    g.links().forEach(link => {
        link.on('mousedown', linkClickHandler)
        // link.on('drag', console.log)
    })


    if (canvas.nextSibling) {
        canvas.parentNode.removeChild(canvas.nextSibling)
    }

    // add default lasso behavior
    // g.initLasso(canvas.parentNode)
    // g.on('lasso', () => {})
    // g.toggleLasso(false)

    function initActions() {
        g.initLasso(canvas.parentNode)
        g.on('lasso', (nodes) => {
            cleanLassoSelection(g);

            const selectedNodes = nodes.map(n => {
                lassoItems.add(n.id);
                return {
                    id: n.id,
                    x: n.x,
                    y: n.y,
                }
            });

            const selectedLinks = getLinkFromNodes(g, selectedNodes);
            const exportData = {
                nodes: selectedNodes,
                links: selectedLinks
            };

            onLassoCallback(exportData);

            g.beginBatch();
            // TODO: need redefine lasso behavior
            nodes.forEach(n => {
                n.fill = defalutStyle.wholeGraph.nodeHighlight.fill;
                n.r = 8;
            });
            for (const { source, target } of selectedLinks) {
                const glink = g.getLinkByEnd(source, target);
                glink.strokeColor = defalutStyle.wholeGraph.linkHighLight.strokeColor;
            }

            g.endBatch();
            g.refresh();
        });

        g.toggleLasso(false);
    }

    if (hasPosition) {
        initActions();
        g.refresh();
        g.refresh();
    } else {
        // without position, use force layout
        const layout = g.layout('force');
        layout.onEnd(() => {
            // after layout set position
            // TODO: 很奇怪，不知道为什么，设置位置的方式有点dirty
            data.nodes.forEach(n => {
                const gnode = g.getNodeById('' + n.id);
                n.x = gnode.x;
                n.y = gnode.y;
            })
            initActions();
        });

        layout.run();
    }
}