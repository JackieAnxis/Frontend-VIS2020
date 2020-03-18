export function GraphTransformer(data, width, height, padding) {
    if (!data)
        return null;

    const minX = Math.min(...data.nodes.map(n => n.x));
    const maxX = Math.max(...data.nodes.map(n => n.x));
    const minY = Math.min(...data.nodes.map(n => n.y));
    const maxY = Math.max(...data.nodes.map(n => n.y));

    const ratio = Math.max((maxX - minX), (maxY - minY))

    return {
        transform,
        detransform,
        transformPos,
    }

    function transformPos(pos) {
        const transformX = val => {
            return (val - (maxX + minX) / 2) / (ratio) * (height - padding * 2) + (width / 2);
            // return (val - minX) * ratio;
        };
        const transformY = val => {
            return (val - (maxY + minY) / 2) / (ratio) * (height - padding * 2) + (height / 2);
            // return (val - minY) * ratio;
        };
        return {
            x: transformX(pos.x),
            y: transformY(pos.y),
        }
    }

    function transform() {
        const transformX = val => {
            return (val - (maxX + minX) / 2) / (ratio) * (height - padding * 2) + (width / 2);
            // return (val - minX) * ratio;
        };
        const transformY = val => {
            return (val - (maxY + minY) / 2) / (ratio) * (height - padding * 2) + (height / 2);
            // return (val - minY) * ratio;
        };

        const res = JSON.parse(JSON.stringify(data));

        res.nodes.forEach(n => {
            const p = transformPos(n)
            n.x = p.x;
            n.y = p.y;
            // n.x = transformX(p.x);
            // n.y = transformY(p.y);
        });

        return res;
    }

    function detransform(data) {
        const transformX = val => {
            return ((val - width / 2) / (height - padding * 2)) * ratio + (maxX + minX) / 2;
        };
        const transformY = val => {
            return ((val - height / 2) / (height - padding * 2)) * ratio + (maxY + minY) / 2;
        };

        const res = JSON.parse(JSON.stringify(data));

        res.nodes.forEach(n => {
            n.x = transformX(n.x);
            n.y = transformY(n.y);
        });

        return res;
    }
}

export function getGraphCenter(graph) {
    const x = graph.nodes.map(n => n.x).reduce((a, b) => a + b, 0) / graph.nodes.length
    const y = graph.nodes.map(n => n.y).reduce((a, b) => a + b, 0) / graph.nodes.length
    return {
        x,
        y
    }
}