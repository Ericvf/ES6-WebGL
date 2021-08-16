class Grid {
    constructor(graphics, width, height) {
        this.width = width;
        this.height = height;
        this.scale = 2;
        this.load(graphics);
    }

    load(graphics) {
        const x = this.width / 2;
        const y = 0;
        const z = this.height / 2;

        var vertices = [-x, y, z,
            x, y, z, -x, -y, -z,
            x, -y, -z
        ];

        var colors = [
            255, 0, 255,
            0, 255, 0,
            0, 0, 255,
            255, 0, 255
        ];

        var indices = [
            0,
            1,
            2,

            2,
            1,
            3
        ];

        this.geometry = {
            primitiveCount: indices.length,
            world: m4.identity(),
            depthtest: true,
            alpha: 1,
            buffers: {
                vertex: graphics.createVertexBuffer(vertices),
                color: graphics.createColorBuffer(colors),
                index: graphics.createIndexBuffer(indices),
            }
        };
    }
}