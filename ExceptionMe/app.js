var ExceptionMeDraw = (function () {
    function ExceptionMeDraw() {
    }
    ExceptionMeDraw.prototype.init = function () {
        var r = new THREE.WebGLRenderer({ antialias: true });
        if (r) {
            var width = window.innerWidth / 2;
            var height = window.innerHeight / 2;
            r.setSize(width, height);
            r.setClearColorHex(0x4598ef, 1);
            document.querySelector("#viewport").appendChild(r.domElement);

            var fov = 100;
            var aspect = width / height;
            var cam = new THREE.PerspectiveCamera(fov, aspect);
            cam.position = new THREE.Vector3(0, 0, 1000);

            var scene = new THREE.Scene();

            var dirLight = new THREE.DirectionalLight(0xffffff, 1);
            dirLight.position = new THREE.Vector3(0, 0, 1);
            scene.add(dirLight);

            var geo = new THREE.CubeGeometry(500, 500, 500);
            var mat = new THREE.MeshLambertMaterial({ color: 0xff0000 });
            var cube = new THREE.Mesh(geo, mat);
            scene.add(cube);

            r.render(scene, cam);
            console.log("init");
            this.render(r, scene, cam, cube);
        } else {
            console.log("err");
        }
    };
    ExceptionMeDraw.prototype.render = function (r, sc, cam, cube) {
        var _this = this;
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        r.render(sc, cam);

        requestAnimationFrame(function () {
            return _this.render(r, sc, cam, cube);
        });
    };
    return ExceptionMeDraw;
})();

window.onload = function () {
    var d = new ExceptionMeDraw();
    d.init();
};
