class Camera {

    constructor() {
        this.world = m4.identity();
        this.positionX = 0;
        this.positionY = 10;
        this.positionZ = 50;

        this.isLeft = false;
        this.isRight = false;
        this.isUp = false;
        this.isDown = false;
        this.fPosition = [0, 0, 0];
        this.yaw = 0;
        this.pitch = 0;
        this.initEvents();
    }

    update(t) {
        const f = 0.5;
        if (this.isLeft) {
            this.positionX -= f;
        }
        if (this.isRight) {
            this.positionX += f;
        }
        if (this.isUp) {
            this.positionZ -= f;
        }
        if (this.isDown) {
            this.positionZ += f;
        }

        let world = m4.identity();
        world = m4.translate(world, this.positionX, this.positionY, this.positionZ);
        // world = m4.yRotate(world, Utils.degToRad(0)); 

        var cameraPosition = [
            this.positionX, this.positionY, this.positionZ
        ];
        const cos = Math.cos;
        const sin = Math.sin;

        const fPosition = [
            this.positionX + cos(Utils.degToRad(this.yaw)) * cos(Utils.degToRad(this.pitch)),
            this.positionY + sin(Utils.degToRad(this.pitch)),
            this.positionZ + sin(Utils.degToRad(this.yaw)) * cos(Utils.degToRad(this.pitch))
        ];

        var up = [0, 1, 0];

        // world = m4.lookAt(cameraPosition, fPosition, up);
        world = m4.inverse(world);
        this.world = world;
    }

    handleKey(code, state) {
        switch (code) {
            case "ArrowLeft":
                this.isLeft = state;
                break;
            case "ArrowRight":
                this.isRight = state;
                break;
            case "ArrowUp":
                this.isUp = state;
                break;
            case "ArrowDown":
                this.isDown = state;
                break;
        }
    }

    handleMouse(event) {
        // console.log(event);
        // this.yaw   += event.movementX * 0.1;
        // this.pitch += -event.movementY * 0.3;

        // if(pitch > 89.0f)
        // pitch = 89.0f;
        // if(pitch < -89.0f)
        // pitch = -89.0f;

        // m4.vec3 front;
        // front.x = cos(m4.radians(yaw)) * cos(m4.radians(pitch));
        // front.y = sin(m4.radians(pitch));
        // front.z = sin(m4.radians(yaw)) * cos(m4.radians(pitch));
        // cameraFront = m4.normalize(front);
    }

    initEvents() {
        document.addEventListener('keydown', event => {
            if (!event.repeat)
                this.handleKey(event.code, true);
        });
        document.addEventListener('keyup', event => {
            if (!event.repeat)
                this.handleKey(event.code, false);
        });

        document.addEventListener('mousemove', event => {
            this.handleMouse(event);
        });

    }
}