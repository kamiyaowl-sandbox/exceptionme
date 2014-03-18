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
            cam.position = new THREE.Vector3(0, 0, 500);

            d.renderer = r;
            d.camera = cam;
            d.width = width;
            d.height = height;
            d.init();
        } else {
            console.log("WebGLRenderer init failed.");
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
var PositionManager = (function () {
    function PositionManager(arr) {
        this.arr = arr;
        this.circleMoveDiff = 0;
    }
    PositionManager.prototype.all = function (f) {
        for (var i = 0; i < this.arr.length; ++i) {
            f(this.arr[i]);
        }
    };
    PositionManager.prototype.circle = function (center, r, ap, phi) {
        if (typeof ap === "undefined") { ap = null; }
        if (typeof phi === "undefined") { phi = 0; }
        if (!ap)
            ap = function (t, x, y) {
                t.position.x = x;
                t.position.y = y;
            };

        var count = this.arr.length;
        for (var i = 0; i < count; ++i) {
            var rad = 2 * Math.PI * i / count + phi;
            var x = r * Math.cos(rad) + center.x;
            var y = r * Math.sin(rad) + center.y;

            ap(this.arr[i], x, y);
        }
    };
    PositionManager.prototype.circleStraight = function (center, r, diff, ap) {
        if (typeof ap === "undefined") { ap = null; }
        this.circle(center, r, ap, this.circleMoveDiff);
        this.circleMoveDiff += diff;
    };
    PositionManager.prototype.circleMove = function (center, r, time, ease) {
        if (typeof ease === "undefined") { ease = null; }
        this.circle(new THREE.Vector3(0, 0, 0), r, function (t, x, y) {
            createjs.Tween.get(t.position).to({ 'x': x, 'y': y }, time, ease);
        });
    };
    return PositionManager;
})();

var CubeDraw = (function () {
    function CubeDraw() {
    }
    CubeDraw.prototype.init = function () {
        this.scene = new THREE.Scene();

        var dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position = new THREE.Vector3(0, 0, 1);
        this.scene.add(dirLight);

        var arr = new Array();
        for (var i = 0; i < 10; ++i) {
            var geo = new THREE.CubeGeometry(100, 100, 100);
            var mat = new THREE.MeshLambertMaterial({ color: 0xffff00 });
            var cube = new THREE.Mesh(geo, mat);
            arr.push(cube);
            this.scene.add(cube);
        }
        this.pm = new PositionManager(arr);
        this.pm.circleMove(new THREE.Vector3(0, 0, 0), 500, 1000, createjs.Ease.cubicInOut);
        createjs.Ticker.setFPS(30);

        this.renderer.render(this.scene, this.camera);
    };
    CubeDraw.prototype.draw = function () {
        this.pm.all(function (m) {
            m.rotation.x += 0.01;
            m.rotation.y += 0.01;
        });

        console.log("draw");
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
