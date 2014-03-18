/// <reference path="scripts/threemodule.ts" />
class ExceptionMeDraw {
    init() {
        var r = new THREE.WebGLRenderer({ antialias: true });
        if (r) {
            //html init
            var width = window.innerWidth;
            var height = window.innerHeight / 2;
            r.setSize(width, height);
            r.setClearColor(0x000000, 1);
            document.querySelector("#viewport").appendChild(r.domElement);
            //camera init
            var fov = 100;//画角
            var aspect = width / height;
            var cam = new THREE.PerspectiveCamera(fov, aspect);
            cam.position = new THREE.Vector3(0, 0, 1000);
            //scene init
            var scene = new THREE.Scene();

            var dirLight = new THREE.DirectionalLight(0xffffff, 1);
            dirLight.position = new THREE.Vector3(0, 0, 1);
            scene.add(dirLight);
            //mesh
            var geo = new THREE.CubeGeometry(500, 500, 500);
            var mat = new THREE.MeshLambertMaterial({ color: 0xffff00 });
            var cube = new THREE.Mesh(geo, mat);
            scene.add(cube);


            r.render(scene, cam);
            console.log("init");
            this.render(r, scene, cam, cube);
        } else {
            console.log("err");
        }
    }
    private render(r: THREE.Renderer, sc: THREE.Scene, cam: THREE.Camera, cube: THREE.Mesh) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        r.render(sc, cam);
        //nearly setInterval
        requestAnimationFrame(() => this.render(r, sc, cam, cube));
    }
}


window.onload = () => {
    var d = new ExceptionMeDraw();
    d.init();
};