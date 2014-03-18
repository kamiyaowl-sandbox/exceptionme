/// <reference path="scripts/threemodule.ts" />
class ExceptionMeDraw {
    init() {
        var r = new THREE.WebGLRenderer({ antialias: true });
        if (r) {
            //html init
            r.setSize(window.innerWidth, window.innerHeight);
            r.setClearColorHex(0x000000, 1);
            document.querySelector("#viewport").appendChild(r.domElement);
            //camera init
            var fov = 100;//画角
            var aspect = window.innerWidth / window.innerHeight;
            var cam = new THREE.PerspectiveCamera(fov, aspect);
            cam.position = new THREE.Vector3(0, 0, 1000);
            //scene init
            var scene = new THREE.Scene();

            var dirLight = new THREE.DirectionalLight(0xffffff, 1);
            dirLight.position = new THREE.Vector3(0, 0, 1);
            scene.add(dirLight);
            //mesh
            var geo = new THREE.CubeGeometry(500, 500, 500);
            var mat = new THREE.MeshLambertMaterial({ color: 0xff0000 });
            var cube = new THREE.Mesh(geo, mat);
            scene.add(cube);


            r.render(scene, cam);
            console.log("init");
        } else {
            console.log("err");
        }
    }
}


window.onload = () => {
    var d = new ExceptionMeDraw();
    d.init();
};