var LoopDrawing = (function () {
    function LoopDrawing(d, w, viewport) {
        this.d = d;
        this.w = w;
        this.viewport = viewport;
        var r = new THREE.WebGLRenderer({ antialias: true });
        if (r) {
            var width = w.innerWidth;
            var height = w.innerHeight / 2;

            r.setSize(width, height);
            r.setClearColor(0x000000, 1);
            viewport.appendChild(r.domElement);

            var fov = 100;
            var aspect = width / height;
            var cam = new THREE.PerspectiveCamera(fov, aspect);
            cam.position = new THREE.Vector3(0, 0, 1000);

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
    LoopDrawing.prototype.draw = function () {
        var _this = this;
        this.d.draw();

        requestAnimationFrame(function () {
            return _this.draw();
        });
    };
    return LoopDrawing;
})();

var CubeDraw = (function () {
    function CubeDraw() {
    }
    CubeDraw.prototype.init = function () {
        this.scene = new THREE.Scene();

        var dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position = new THREE.Vector3(0, 0, 1);
        this.scene.add(dirLight);

        var geo = new THREE.CubeGeometry(500, 500, 500);
        var mat = new THREE.MeshLambertMaterial({ color: 0xffff00 });
        this.cube = new THREE.Mesh(geo, mat);

        this.scene.add(this.cube);

        this.renderer.render(this.scene, this.camera);
    };
    CubeDraw.prototype.draw = function () {
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;

        this.renderer.render(this.scene, this.camera);
    };
    return CubeDraw;
})();

window.onload = function () {
    var target = document.querySelector("#viewport");
    var cd = new CubeDraw();

    var ld = new LoopDrawing(cd, window, target);
    ld.draw();
};
