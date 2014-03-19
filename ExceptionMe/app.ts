/// <reference path="scripts/typings/easeljs/easeljs.d.ts" />
/// <reference path="scripts/typings/createjs/createjs.d.ts" />
/// <reference path="scripts/typings/tweenjs/tweenjs.d.ts" />
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
            //element init
            var width = w.innerWidth;
            var height = w.innerHeight / 2;
            //renderer init
            r.setSize(width, height);
            r.setClearColor(0x000000, 1);
            viewport.appendChild(r.domElement);
            //camera init
            var fov = 100;
            var aspect = width / height;
            var cam = new THREE.PerspectiveCamera(fov, aspect);
            cam.position = new THREE.Vector3(0, 0, 500);
            //IDrawable init
            d.renderer = r;
            d.camera = cam;
            d.width = width;
            d.height = height;
            d.init();
        } else {
            console.log("WebGLRenderer init failed.");
        }
    }
    draw() {
        this.d.draw();
        requestAnimationFrame(() => this.draw());
    }
}
class MeshMover {
    static pattern: Array<boolean[]>;

    static init() {
        this.pattern = new Array<boolean[]>();
        this.pattern[0] = [
            false, true, true, true, false,
            false, true, false, true, false,
            false, true, false, true, false,
            false, true, false, true, false,
            false, true, true, true, false,
        ];
        this.pattern[1] = [
            false, true, true, false, false,
            false, false, true, false, false,
            false, false, true, false, false,
            false, false, true, false, false,
            false, true, true, true, false,
        ];
        this.pattern[2] = [
            false, true, true, true, false,
            false, false, false, true, false,
            false, true, true, true, false,
            false, true, false, false, false,
            false, true, true, true, false,
        ];
        this.pattern[3] = [
            false, true, true, true, false,
            false, false, false, true, false,
            false, true, true, true, false,
            false, false, false, true, false,
            false, true, true, true, false,
        ];
        this.pattern[4] = [
            false, true, false, true, false,
            false, true, false, true, false,
            false, true, false, true, false,
            false, true, true, true, true,
            false, false, false, true, false,
        ];
        this.pattern[5] = [
            false, true, true, true, false,
            false, true, false, false, false,
            false, true, true, true, false,
            false, false, false, true, false,
            false, true, true, true, false,
        ];
        this.pattern[6] = [
            false, true, true, true, false,
            false, true, false, false, false,
            false, true, true, true, false,
            false, true, false, true, false,
            false, true, true, true, false,
        ];
        this.pattern[7] = [
            false, true, true, true, false,
            false, false, false, true, false,
            false, false, false, true, false,
            false, false, false, true, false,
            false, false, false, true, false,
        ];
        this.pattern[8] = [
            false, true, true, true, false,
            false, true, false, true, false,
            false, true, true, true, false,
            false, true, false, true, false,
            false, true, true, true, false,
        ];
        this.pattern[9] = [
            false, true, true, true, false,
            false, true, false, true, false,
            false, true, true, true, false,
            false, false, false, true, false,
            false, true, true, true, false,
        ];
        this.pattern[':'] = [
            false, false, false, false, false,
            false, false, true, false, false,
            false, false, false, false, false,
            false, false, true, false, false,
            false, false, false, false, false,
        ];
    }
    static move(n: any, arr: Array<THREE.Mesh>, start: THREE.Vector3, margin: number, ap: (i: number, t: THREE.Mesh, x: number, y: number) => void = null) {
        if (!ap) ap = (i, t, x, y) => {
            t.position.x = x;
            t.position.y = y;       
        }

        if (!this.pattern) this.init();
        var srcCnt = 0;
        var target = this.pattern[n];
        if (target) {
            for (var targetCnt = 0; targetCnt < 25; ++targetCnt) {
                if (target[targetCnt]) {
                    var x = start.x + (targetCnt % 5) * margin;
                    var y = start.y - (targetCnt / 5 << 0) * margin;
                    if (!arr[targetCnt]) break;
                    console.log(arr.length,targetCnt, arr[targetCnt], x, y);
                    ap(targetCnt, arr[srcCnt], x, y);
                    ++srcCnt;
                }
            }
        }
        return arr.slice(srcCnt);
    }
    static moveSmooth(n: any, arr: Array<THREE.Mesh>, start: THREE.Vector3, margin: number, time: number, ease: (amount: number) => number) {
        return this.move(n, arr, start, margin, (i, t, x, y) => {
            createjs.Tween.get(t.position).to({ 'x': x, 'y': y }, time, ease);
        });
    }
}
//extension methods
interface Array<T> {
    move(n: any, start: THREE.Vector3, margin: number, ap: (i: number, t: THREE.Mesh, x: number, y: number) => void);
    moveSmooth(n: any, start: THREE.Vector3, margin: number, time: number, ease: (amount: number) => number);
}
Array.prototype.move = function(n: any, start: THREE.Vector3, margin: number, ap: (i: number, t: THREE.Mesh, x: number, y: number) => void = null) {
    return MeshMover.move(n, this, start, margin, ap);
}
 Array.prototype.moveSmooth = function(n: any, start: THREE.Vector3, margin: number, time: number, ease: (amount: number) => number = null)  {
     return MeshMover.moveSmooth(n, this, start, margin, time, ease);
 }


class PositionManager{
    circleMoveDiff: number = 0;
    constructor(public arr: Array<THREE.Mesh>) {
    }
    all(f:(m:THREE.Mesh,i:number) => void) {
        for (var i = 0; i < this.arr.length; ++i) {
            f(this.arr[i],i);
        }
    }
    circle(center: THREE.Vector3, r: number, ap: (target:THREE.Mesh, x: number, y: number) => void = null,phi:number = 0) {
        //default
        if (!ap) ap = (t, x, y) => {
            t.position.x = x;
            t.position.y = y;
        }

        var count = this.arr.length;
        for (var i = 0; i < count; ++i) {
            var rad = 2 * Math.PI * i / count + phi;
            var x = r * Math.cos(rad) + center.x;
            var y = r * Math.sin(rad) + center.y;

            ap(this.arr[i], x, y);
        }
    }
    circleStraight(center: THREE.Vector3, r: number, diff: number, ap: (target: THREE.Mesh, x: number, y: number) => void = null) {
        this.circle(center, r, ap, this.circleMoveDiff);
        this.circleMoveDiff += diff;
    }
    circleMove(center: THREE.Vector3, r: number, time: number, ease:(amount:number) => number = null) {
        this.circle(new THREE.Vector3(0, 0, 0), r, (t, x, y) => {
            createjs.Tween.get(t.position).to({ 'x': x, 'y': y }, time,ease);
        });
    }
}

class CubeDraw implements IDrawable {
    renderer: THREE.Renderer;
    camera: THREE.Camera;
    width: number;
    height: number;

    pm: PositionManager;
    scene: THREE.Scene;

    init() {
        //scene init
        this.scene = new THREE.Scene();

        var dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position = new THREE.Vector3(0, 0, 1);
        this.scene.add(dirLight);
        //mesh
        var arr = new Array<THREE.Mesh>();
        for (var i = 0; i < 100; ++i) {
            var geo = new THREE.CubeGeometry(100, 100, 100);
            var mat = new THREE.MeshLambertMaterial({ color: 0xffff00 });
            var cube = new THREE.Mesh(geo, mat);
            arr.push(cube);
            this.scene.add(cube);
        }
        this.pm = new PositionManager(arr);
        //this.pm.circleMove(new THREE.Vector3(0, 0, 0), 500, 1000, createjs.Ease.cubicInOut);
        //MeshMover.move(0,arr, new THREE.Vector3(0, 0, 0), 100);
        var f = arr.moveSmooth(1, new THREE.Vector3(-500, 0, 0), 100, 1000, createjs.Ease.cubicInOut).moveSmooth(2, new THREE.Vector3(0, 0, 0), 100, 1000, createjs.Ease.cubicInOut).moveSmooth(3, new THREE.Vector3(500, 0, 0), 100, 1000, createjs.Ease.cubicInOut).moveSmooth(4, new THREE.Vector3(1000, 0, 0), 100, 1000, createjs.Ease.cubicInOut);
        createjs.Ticker.setFPS(30);

        this.renderer.render(this.scene, this.camera);
    }
    draw() {
        //this.pm.circleMove(new THREE.Vector3(0, 0, 0), 300, 0.1, (t, x, y) => {
        //    t.position.x = x;
        //    t.position.y = y;
        //});

        //this.pm.all((m,i) => {
        //    m.rotation.x += 0.01 * i;
        //    m.rotation.y += 0.01 * i;
        //});

        console.log("draw");
        this.renderer.render(this.scene,this.camera);
    }
}


window.onload = () => {
    var target = document.querySelector("#viewport");
    var cd = new CubeDraw();

    var ld = new LoopDrawing(cd, window, target);
    ld.draw();
};