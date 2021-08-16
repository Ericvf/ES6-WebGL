class Mesh {

    constructor() {
        this.scale = 2;
    }

    async load(graphics, url) {
        const model = document.model = await Utils.get(url);

        const vertices = model.meshes[0].vertices;
        const indices = model.meshes[0].faces.flat();
        const normals = model.meshes[0].normals;

        console.log("vertices", vertices.length);
        console.log("indices", indices.length);
        console.log("normals", normals.length);
        console.log("faces ", model.meshes[0].faces.length);

        const primitiveCount = indices.length; //vertices.length / 3;
        const colors = new Array(primitiveCount)
            .fill([255, 255, 0])
            .flat();

        this.geometry = {
            primitiveCount: primitiveCount, // For vertices
            world: model.rootnode.transformation,
            depthtest: true,
            alpha: 1,
            buffers: {
                vertex: graphics.createVertexBuffer(vertices),
                index: graphics.createIndexBuffer(indices),
                color: graphics.createColorBuffer(colors),
                normal: graphics.createNormalBuffer(normals)
            }
        };

        return this;
    }
}