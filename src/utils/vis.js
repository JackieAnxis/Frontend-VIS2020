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
            n.x = transformX(n.x);
            n.y = transformY(n.y);
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
