var LoopDrawing = (function () {
    function LoopDrawing(d, w, viewport) {
        this.d = d;
        this.w = w;
        this.viewport = viewport;
        var r = new THREE.WebGLRenderer({ antialias: true });
        if (r) {
            var width = w.innerWidth;
            var height = w.innerHeight * 0.9;

            r.setSize(width, height);
            r.setClearColor(0x000000, 1);
            viewport.appendChild(r.domElement);

            var fov = 100;
            var aspect = width / height;
            var cam = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 10, 1500);
            cam.position = new THREE.Vector3(200, 200, 800);
            cam.lookAt(new THREE.Vector3(0, 0, 0));

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
            ap = function (i, t, x, y, z) {
                t.position.x = x;
                t.position.y = y;
                t.position.z = z;
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
                    var z = start.z;
                    if (!arr[targetCnt])
                        break;
                    console.log(arr.length, targetCnt, arr[targetCnt], x, y, z);
                    ap(targetCnt, arr[srcCnt], x, y, z);
                    ++srcCnt;
                }
            }
        }
        return arr.slice(srcCnt);
    };
    MeshMover.moveSmooth = function (n, arr, start, margin, time, ease) {
        return this.move(n, arr, start, margin, function (i, t, x, y, z) {
            createjs.Tween.get(t.position).to({ 'x': x, 'y': y, 'z': z }, time, ease);
        });
    };
    return MeshMover;
})();
var PositionManager = (function () {
    function PositionManager() {
    }
    PositionManager.all = function (arr, f) {
        for (var i = 0; i < arr.length; ++i) {
            f(arr[i], i);
        }
    };
    PositionManager.circle = function (arr, center, r, ap, phi) {
        if (typeof ap === "undefined") { ap = null; }
        if (typeof phi === "undefined") { phi = 0; }
        if (!ap)
            ap = function (t, x, y, z) {
                t.position.x = x;
                t.position.y = y;
                t.position.z = z;
            };

        var count = arr.length;
        for (var i = 0; i < count; ++i) {
            var rad = 2 * Math.PI * i / count + phi;
            var x = r * Math.cos(rad) + center.x;
            var y = r * Math.sin(rad) + center.y;
            var z = center.z;
            ap(arr[i], x, y, z);
        }
    };
    PositionManager.circleMove = function (arr, center, r, time, ease) {
        if (typeof ease === "undefined") { ease = null; }
        this.circle(arr, new THREE.Vector3(0, 0, 0), r, function (t, x, y, z) {
            createjs.Tween.get(t.position).to({ 'x': x, 'z': y, 'y': z }, time, ease);
        });
    };
    return PositionManager;
})();

Array.prototype.move = function (n, start, margin, ap) {
    if (typeof ap === "undefined") { ap = null; }
    return MeshMover.move(n, this, start, margin, ap);
};
Array.prototype.moveSmooth = function (n, start, margin, time, ease) {
    if (typeof ease === "undefined") { ease = null; }
    return MeshMover.moveSmooth(n, this, start, margin, time, ease);
};

Array.prototype.circleMove = function circleMove(center, r, time, ease) {
    if (typeof ease === "undefined") { ease = null; }
    PositionManager.circleMove(this, center, r, time, ease);
};

var CubeDraw = (function () {
    function CubeDraw() {
        var _this = this;
        this.animation = function () {
            var date = new Date();
            var hh = date.getHours() / 10 << 0;
            var hl = date.getHours() % 10 << 0;
            var mh = date.getMinutes() / 10 << 0;
            var ml = date.getMinutes() % 10 << 0;
            var sh = date.getSeconds() / 10 << 0;
            var sl = date.getSeconds() % 10 << 0;
            _this.arr.moveSmooth(hh, new THREE.Vector3(-4 * _this.space, -_this.basePos, 0), _this.margin, _this.time, createjs.Ease.cubicInOut).moveSmooth(hl, new THREE.Vector3(-3 * _this.space, -_this.basePos, 0), _this.margin, _this.time, createjs.Ease.cubicInOut).moveSmooth(':', new THREE.Vector3(-2 * _this.space, -_this.basePos, 0), _this.margin, _this.time, createjs.Ease.cubicInOut).moveSmooth(mh, new THREE.Vector3(-_this.space, -_this.basePos, 0), _this.margin, _this.time, createjs.Ease.cubicInOut).moveSmooth(ml, new THREE.Vector3(0, -_this.basePos, 0), _this.margin, _this.time, createjs.Ease.cubicInOut).moveSmooth(':', new THREE.Vector3(_this.space, -_this.basePos, 0), _this.margin, _this.time, createjs.Ease.cubicInOut).moveSmooth(sh, new THREE.Vector3(2 * _this.space, -_this.basePos, 0), _this.margin, _this.time, createjs.Ease.cubicInOut).moveSmooth(sl, new THREE.Vector3(3 * _this.space, -_this.basePos, 0), _this.margin, _this.time, createjs.Ease.cubicInOut).circleMove(new THREE.Vector3(_this.basePos, 0, 0), 4 * _this.space, 1000, createjs.Ease.cubicInOut);

            setTimeout(_this.animation, _this.time);
        };
    }
    CubeDraw.prototype.init = function () {
        this.scene = new THREE.Scene();

        var dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position = new THREE.Vector3(0, 0, 1);
        this.scene.add(dirLight);

        var objectCount = 25 * 8;
        var size = 30;
        this.arr = new Array();
        for (var i = 0; i < objectCount; ++i) {
            var geo = new THREE.CubeGeometry(size, size, size);
            var mat = new THREE.MeshLambertMaterial({ color: 0xffff00 });
            var cube = new THREE.Mesh(geo, mat);
            this.arr.push(cube);
            this.scene.add(cube);
        }
        createjs.Ticker.setFPS(30);

        this.margin = size * 1.1;
        this.time = 1000;
        this.space = this.margin * 5;
        this.basePos = -this.space / 2;
        this.animation();

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
