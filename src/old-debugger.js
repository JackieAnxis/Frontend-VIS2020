import { store } from './App';
import { compute } from './actions';
import { search } from './actions/exemplar';
import { defalutStyle } from './config';

function graphHighlighter() {
    let highlightNodes = [];
    let highlightLinks = [];


    function clearHighlight() {
        const g = window.g;

        g.beginBatch();
        for (const id of highlightNodes) {
            const node = g.getNodeById(id);
            node.fill = defalutStyle.wholeGraph.node.fill;
            node.strokeWidth = defalutStyle.wholeGraph.node.strokeWidth;
            node.r = defalutStyle.wholeGraph.node.r;
            node.strokeColor = defalutStyle.wholeGraph.node.strokeColor;
        }
        for (const { sid, tid } of highlightLinks) {
            const glink = g.getLinkByEnd(sid, tid);
            glink.strokeColor = defalutStyle.wholeGraph.link.strokeColor;
        }

        g.endBatch();
        g.refresh();

        highlightNodes = [];
        highlightLinks = [];
    }


    function highlightSubGraph(graph) {
        if (!graph) {
            return;
        }
        const g = window.g;

        clearHighlight(g);

        graph.nodes.forEach(node => {
            highlightNodes.push('' + node.id);
        });

        graph.links.forEach(link => {
            highlightLinks.push({
                sid: '' + link.source,
                tid: '' + link.target,
            });
        });


        g.beginBatch();
        for (const id of highlightNodes) {
            const gnode = g.getNodeById(id);
            gnode.fill = defalutStyle.wholeGraph.nodeHighlight.fill;
        }
        for (const { sid, tid } of highlightLinks) {
            const glink = g.getLinkByEnd(sid, tid);
            glink.strokeColor = defalutStyle.wholeGraph.linkHighLight.strokeColor;
        }
        g.endBatch();
        g.refresh();
    }

    return {
        highlightSubGraph,
        clearHighlight,
    }
}

function initKeyEvent() {
    window.onkeydown = (e) => {
        if (e.shiftKey) {
            window.ADMIN.toggleLasso(true);
        }
    }
    window.onkeyup = (e) => {
        if (!e.shiftKey) {
            window.ADMIN.toggleLasso(false);
        }
    }
}

function getDataOfG() {
    const g = window.g;
    const graph = {
        hasPosition: true,
        nodes: g.nodes().map(n => ({ id: n.id, x: n.x, y: n.y })),
        links: g.links().map(l => ({ source: l.source.id, target: l.target.id }))
    }
    console.log(JSON.stringify(graph));
}

const highlighter = graphHighlighter();

export function initAdmin() {
    window.ADMIN = {
        compute: () => { store.dispatch(compute()) },
        toggleLasso: (enable) => { window.g.toggleLasso(enable) },
        highlightSubGraph: highlighter.highlightSubGraph,
        clearHighlight: highlighter.clearHighlight,
        search: () => { store.dispatch(search()) },
        getDataOfG: getDataOfG,
    }

    initKeyEvent();
}