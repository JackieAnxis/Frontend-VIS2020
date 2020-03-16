export function GraphTransformer(data, width, height, padding) {
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
        const transformX = val => {
            return ((val - minX) / (maxX - minX) - 0.5) * (height - padding * 2) + (width / 2);
        };
        const transformY = val => {
            return ((val - minY) / (maxY - minY) - 0.5) * (height - padding * 2) + (height / 2);
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
            return ((val - width / 2) / (width - padding * 2) + 0.5) * (maxX - minX) + minX;
        };
        const transformY = val => {
            return ((val - height / 2) / (height - padding * 2) + 0.5) * (maxX - minX) + minY;
        };

        const res = JSON.parse(JSON.stringify(data));

        res.nodes.forEach(n => {
            n.x = transformX(n.x);
            n.y = transformY(n.y);
        });

        return res;
    }
}
