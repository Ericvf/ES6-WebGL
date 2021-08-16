class Game {
    constructor() {
        const logger = this.logger = new Logger();
        this.graphics = new Graphics(logger);
        this.camera = new Camera();

        this.entities = [];
        this.entities.push(this.camera);

        this.scene = [];
        this.load();
    }

    async load() {
        const box1 = await new Mesh().load(this.graphics, "/models/box1.stl.json");
        const box2 = await new Mesh().load(this.graphics, "/models/box2.stl.json");
        const box3 = await new Mesh().load(this.graphics, "/models/box3.stl.json");

        const t1 = new Thing(box1);
        const t2 = new Thing(box2);
        const t3 = new Thing(box3);

        t1.speed = 10;
        t2.speed = 0;
        t3.speed = 0;
        t2.positionX = -15;
        t3.positionX = 15;

        const floor = new GameEntity(new Grid(this.graphics, 50, 50));
        this.scene.push(floor);

        const rotator = new Thing(new Grid(this.graphics, 1, 1));
        rotator.speed = 1;
        rotator.positionY = 10;
        this.scene.push(rotator);

        rotator.nodes.push(t1);
        rotator.nodes.push(t2);
        rotator.nodes.push(t3);
    }

    update(t) {
        this.graphics.clear();

        for (const entity of this.entities) {
            entity.update(t);
        }

        for (const node of this.scene) {
            this.drawNode(node, t);
        }
    }

    drawNode(node, t, nodeWorld) {
        node.update(t);

        const world = m4.multiply(nodeWorld || m4.identity(), node.world);
        this.graphics.draw(t, this.camera, node.geometryobject.geometry, world);

        if (node.nodes.length > 0) {
            for (const child of node.nodes) {
                this.drawNode(child, t, world);
            }
        }
    }
}

class GameEntity {
    constructor(geometryobject) {
        this.geometryobject = geometryobject;

        this.scale = 1;
        this.positionX = 0;
        this.positionY = 0;
        this.positionZ = 0;
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;

        this.identityworld = geometryobject.geometry.world;
        this.nodes = [];
        this.world = m4.identity();
    }

    update(t) {
        let world = m4.identity(); // this.identityworld;
        world = m4.translate(world, this.positionX, this.positionY, this.positionZ);
        world = m4.scale(world, this.scale, this.scale, this.scale);
        world = m4.xRotate(world, Utils.degToRad(this.rotationX));
        world = m4.yRotate(world, Utils.degToRad(this.rotationY));
        world = m4.zRotate(world, Utils.degToRad(this.rotationZ));
        this.world = world;
    }
}

class Thing extends GameEntity {
    constructor(geometryobject) {
        super(geometryobject);
        this.speed = 1;
    }

    update(t) {
        this.rotationY = t * 0.01 * this.speed;
        super.update(t);
    }
}