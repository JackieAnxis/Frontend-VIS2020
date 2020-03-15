class Graph {
    constructor(json) {
        this.nodes = json.nodes.map(node => ({
            ...node,
            adj: []
        }))
        this.edges = json.links
        this.nodeMap = {}
        this.nodes.forEach(node => {
            this.nodeMap[node.id] = node
        })
        this.edges.forEach(edge => {
            this.nodeMap[edge['source']].adj.push(this.nodeMap[edge['target']])
            this.nodeMap[edge['target']].adj.push(this.nodeMap[edge['source']])
        })
    }
    subgraph(nodesID) {
        const travedNodes = {}
        const links = []
        nodesID.forEach(nodeID => {
            this.nodeMap[nodeID].adj.forEach(adjNode => {
                if (!(adjNode.id in travedNodes)) {
                    links.push({
                        'source': nodeID,
                        'target': adjNode.id
                    })
                }
            })
            travedNodes[nodeID] = true
        })
        return new Graph({
            nodes: nodesID.map(id => this.nodeMap[id]),
            links
        })
    }
    toJSON() {
        return {
            nodes: this.nodes.map(node => {
                const new_node = {
                    ...node
                }
                delete new_node.adj
                return new_node
            }),
            links: this.edges
        }
    }
}

window.Graph = Graph