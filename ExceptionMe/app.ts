/// <reference path="scripts/threemodule.ts" />
interface IDrawable {
    renderer: THREE.Renderer;
    camera: THREE.Camera;
    width: number;
    height: number;
    init: () => void;
    draw: () => void;
}
class LoopDrawing {
    constructor(private d: IDrawable, private w: Window, private viewport: Element) {
        var r = new THREE.WebGLRenderer({ antialias: true });
        if (r) {
            //html init
            var width = w.innerWidth;
            var height = w.innerHeight / 2;

            r.setSize(width, height);
            r.setClearColor(0x000000, 1);
            viewport.appendChild(r.domElement);
            //camera init
            var fov = 100;//画角
            var aspect = width / height;
            var cam = new THREE.PerspectiveCamera(fov, aspect);
            cam.position = new THREE.Vector3(0, 0, 1000);
            //IDrawable init
            d.renderer = r;
            d.camera = cam;
            d.width = width;
            d.height = height;
            d.init();

            console.log("init");
        } else {
            console.log("err");
        }
    }
    draw() {
        this.d.draw();
        //nearly setInterval
        requestAnimationFrame(() => this.draw());
    }
}

class CubeDraw implements IDrawable {
    renderer: THREE.Renderer;
    camera: THREE.Camera;
    width: number;
    height: number;

    scene: THREE.Scene;
    cube: THREE.Mesh;

    init() {
        //scene init
        this.scene = new THREE.Scene();

        var dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position = new THREE.Vector3(0, 0, 1);
        this.scene.add(dirLight);
        //mesh
        var geo = new THREE.CubeGeometry(500, 500, 500);
        var mat = new THREE.MeshLambertMaterial({ color: 0xffff00 });
        this.cube = new THREE.Mesh(geo, mat);

        this.scene.add(this.cube);

        this.renderer.render(this.scene, this.camera);
    }
    draw() {
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;

        this.renderer.render(this.scene,this.camera);
    }
}



window.onload = () => {
    var target = document.querySelector("#viewport");
    var cd = new CubeDraw();

    var ld = new LoopDrawing(cd, window, target);
    ld.draw();
};