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
var MeshMover = (function () {
    function MeshMover() {
    }
    MeshMover.init = function () {
        this.pattern = new Array();
        this.pattern[0] = [
            false, true, true, true, false,
            false, true, false, true, false,
            false, true, false, true, false,
            false, true, false, true, false,
            false, true, true, true, false
        ];
        this.pattern[1] = [
            false, true, true, false, false,
            false, false, true, false, false,
            false, false, true, false, false,
            false, false, true, false, false,
            false, true, true, true, false
        ];
        this.pattern[2] = [
            false, true, true, true, false,
            false, false, false, true, false,
            false, true, true, true, false,
            false, true, false, false, false,
            false, true, true, true, false
        ];
        this.pattern[3] = [
            false, true, true, true, false,
            false, false, false, true, false,
            false, true, true, true, false,
            false, false, false, true, false,
            false, true, true, true, false
        ];
        this.pattern[4] = [
            false, true, false, true, false,
            false, true, false, true, false,
            false, true, false, true, false,
            false, true, true, true, true,
            false, false, false, true, false
        ];
        this.pattern[5] = [
            false, true, true, true, false,
            false, true, false, false, false,
            false, true, true, true, false,
            false, false, false, true, false,
            false, true, true, true, false
        ];
        this.pattern[6] = [
            false, true, true, true, false,
            false, true, false, false, false,
            false, true, true, true, false,
            false, true, false, true, false,
            false, true, true, true, false
        ];
        this.pattern[7] = [
            false, true, true, true, false,
            false, false, false, true, false,
            false, false, false, true, false,
            false, false, false, true, false,
            false, false, false, true, false
        ];
        this.pattern[8] = [
            false, true, true, true, false,
            false, true, false, true, false,
            false, true, true, true, false,
            false, true, false, true, false,
            false, true, true, true, false
        ];
        this.pattern[9] = [
            false, true, true, true, false,
            false, true, false, true, false,
            false, true, true, true, false,
            false, false, false, true, false,
            false, true, true, true, false
        ];
        this.pattern[':'] = [
            false, false, false, false, false,
            false, false, true, false, false,
            false, false, false, false, false,
            false, false, true, false, false,
            false, false, false, false, false
        ];
    };
    MeshMover.move = function (n, arr, start, margin, ap) {
        if (typeof ap === "undefined") { ap = null; }
        if (!ap)
            ap = function (i, t, x, y) {
                t.position.x = x;
                t.position.y = y;
            };

        if (!this.pattern)
            this.init();
        var srcCnt = 0;
        var target = this.pattern[n];
        if (target) {
            for (var targetCnt = 0; targetCnt < 25; ++targetCnt) {
                if (target[targetCnt]) {
                    var x = start.x + (targetCnt % 5) * margin;
                    var y = start.y - (targetCnt / 5 << 0) * margin;
                    if (!arr[targetCnt])
                        break;
                    console.log(arr.length, targetCnt, arr[targetCnt], x, y);
                    ap(targetCnt, arr[srcCnt], x, y);
                    ++srcCnt;
                }
            }
        }
        return arr.slice(srcCnt);
    };
    MeshMover.moveSmooth = function (n, arr, start, margin, time, ease) {
        return this.move(n, arr, start, margin, function (i, t, x, y) {
            createjs.Tween.get(t.position).to({ 'x': x, 'y': y }, time, ease);
        });
    };
    return MeshMover;
})();

Array.prototype.move = function (n, start, margin, ap) {
    if (typeof ap === "undefined") { ap = null; }
    return MeshMover.move(n, this, start, margin, ap);
};
Array.prototype.moveSmooth = function (n, start, margin, time, ease) {
    if (typeof ease === "undefined") { ease = null; }
    return MeshMover.moveSmooth(n, this, start, margin, time, ease);
};

var PositionManager = (function () {
    function PositionManager(arr) {
        this.arr = arr;
        this.circleMoveDiff = 0;
    }
    PositionManager.prototype.all = function (f) {
        for (var i = 0; i < this.arr.length; ++i) {
            f(this.arr[i], i);
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
        for (var i = 0; i < 100; ++i) {
            var geo = new THREE.CubeGeometry(100, 100, 100);
            var mat = new THREE.MeshLambertMaterial({ color: 0xffff00 });
            var cube = new THREE.Mesh(geo, mat);
            arr.push(cube);
            this.scene.add(cube);
        }
        this.pm = new PositionManager(arr);

        var f = arr.moveSmooth(1, new THREE.Vector3(-500, 0, 0), 100, 1000, createjs.Ease.cubicInOut).moveSmooth(2, new THREE.Vector3(0, 0, 0), 100, 1000, createjs.Ease.cubicInOut).moveSmooth(3, new THREE.Vector3(500, 0, 0), 100, 1000, createjs.Ease.cubicInOut).moveSmooth(4, new THREE.Vector3(1000, 0, 0), 100, 1000, createjs.Ease.cubicInOut);
        createjs.Ticker.setFPS(30);

        this.renderer.render(this.scene, this.camera);
    };
    CubeDraw.prototype.draw = function () {
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
