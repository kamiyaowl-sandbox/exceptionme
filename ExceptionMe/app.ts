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
            var height = w.innerHeight * 0.9;
            //renderer init
            r.setSize(width, height);
            r.setClearColor(0x000000, 1);
            viewport.appendChild(r.domElement);
            //camera init
            var fov = 100;
            var aspect = width / height;
            var cam = new THREE.OrthographicCamera(- width / 2, width / 2, height / 2, - height / 2, 10, 1500);
            cam.position = new THREE.Vector3(200, 200, 800);
            cam.lookAt(new THREE.Vector3(0, 0, 0));
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
    static move(n: any, arr: Array<THREE.Mesh>, start: THREE.Vector3, margin: number, ap: (i: number, t: THREE.Mesh, x: number, y: number,z:number) => void = null) {
        if (!ap) ap = (i, t, x, y, z) => {
            t.position.x = x;
            t.position.y = y;      
            t.position.z = z; 
        }

        if (!this.pattern) this.init();
        var srcCnt = 0;
        var target = this.pattern[n];
        if (target) {
            for (var targetCnt = 0; targetCnt < 25; ++targetCnt) {
                if (target[targetCnt]) {
                    var x = start.x + (targetCnt % 5) * margin;
                    var y = start.y - (targetCnt / 5 << 0) * margin;
                    var z = start.z;
                    if (!arr[targetCnt]) break;
                    console.log(arr.length,targetCnt, arr[targetCnt], x, y, z);
                    ap(targetCnt, arr[srcCnt], x, y, z);
                    ++srcCnt;
                }
            }
        }
        return arr.slice(srcCnt);
    }
    static moveSmooth(n: any, arr: Array<THREE.Mesh>, start: THREE.Vector3, margin: number, time: number, ease: (amount: number) => number) {
        return this.move(n, arr, start, margin, (i, t, x, y, z) => {
            createjs.Tween.get(t.position).to({ 'x': x, 'y': y , 'z' : z}, time, ease);
        });
    }
}
class PositionManager{
    static all(arr: Array<THREE.Mesh>,f:(m:THREE.Mesh,i:number) => void) {
        for (var i = 0; i < arr.length; ++i) {
            f(arr[i],i);
        }
    }
    static circle(arr: Array<THREE.Mesh>,center: THREE.Vector3, r: number, ap: (target:THREE.Mesh, x: number, y: number, z:number) => void = null,phi:number = 0) {
        //default
        if (!ap) ap = (t, x, y, z) => {
            t.position.x = x;
            t.position.y = y;
            t.position.z = z;
        }

        var count = arr.length;
        for (var i = 0; i < count; ++i) {
            var rad = 2 * Math.PI * i / count + phi;
            var x = r * Math.cos(rad) + center.x;
            var y = r * Math.sin(rad) + center.y;
            var z = center.z;
            ap(arr[i], x, y, z);
        }
    }
    static circleMove(arr: Array<THREE.Mesh>,center: THREE.Vector3, r: number, time: number, ease:(amount:number) => number = null) {
        this.circle(arr,new THREE.Vector3(0, 0, 0), r, (t, x, y, z) => {
            createjs.Tween.get(t.position).to({ 'x': x, 'z': y , 'y': z}, time,ease);
        });
    }
}
//extension methods
interface Array<T> {
    move(n: any, start: THREE.Vector3, margin: number, ap: (i: number, t: THREE.Mesh, x: number, y: number) => void);
    moveSmooth(n: any, start: THREE.Vector3, margin: number, time: number, ease: (amount: number) => number);

    circleMove(center: THREE.Vector3, r: number, time: number, ease: (amount: number) => number);

}
Array.prototype.move = function(n: any, start: THREE.Vector3, margin: number, ap: (i: number, t: THREE.Mesh, x: number, y: number, z:number) => void = null) {
    return MeshMover.move(n, this, start, margin, ap);
}
Array.prototype.moveSmooth = function(n: any, start: THREE.Vector3, margin: number, time: number, ease: (amount: number) => number = null)  {
     return MeshMover.moveSmooth(n, this, start, margin, time, ease);
 }

Array.prototype.circleMove = function circleMove(center: THREE.Vector3, r: number, time: number, ease: (amount: number) => number = null) {
    PositionManager.circleMove(this, center, r, time, ease);
}


class CubeDraw implements IDrawable {
    renderer: THREE.Renderer;
    camera: THREE.Camera;
    width: number;
    height: number;

    scene: THREE.Scene;

    arr: Array<THREE.Mesh>;
    margin: number;
    time: number;
    space: number;
    basePos: number;


    init() {
        //scene init
        this.scene = new THREE.Scene();

        var dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position = new THREE.Vector3(0, 0, 1);
        this.scene.add(dirLight);
        //mesh
        var objectCount = 25 * 8;
        var size = 30;
        this.arr = new Array<THREE.Mesh>();
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
        this.basePos = - this.space / 2;
        this.animation();

        this.renderer.render(this.scene, this.camera);
    }
    draw() {
        console.log("draw");
        this.renderer.render(this.scene,this.camera);
    }
    animation = () => {
        var date = new Date();
        var hh = date.getHours() / 10 << 0;
        var hl = date.getHours() % 10 << 0;
        var mh = date.getMinutes() / 10 << 0;
        var ml = date.getMinutes() % 10 << 0;
        var sh = date.getSeconds() / 10 << 0;
        var sl = date.getSeconds() % 10 << 0;
        this.arr
            .moveSmooth(hh,  new THREE.Vector3(-4 * this.space, - this.basePos, 0), this.margin, this.time, createjs.Ease.cubicInOut)
            .moveSmooth(hl,  new THREE.Vector3(-3 * this.space, - this.basePos, 0), this.margin, this.time, createjs.Ease.cubicInOut)
            .moveSmooth(':', new THREE.Vector3(-2 * this.space, - this.basePos, 0), this.margin, this.time, createjs.Ease.cubicInOut)
            .moveSmooth(mh,  new THREE.Vector3(- this.space, - this.basePos, 0), this.margin, this.time, createjs.Ease.cubicInOut)
            .moveSmooth(ml,  new THREE.Vector3(0, - this.basePos, 0), this.margin, this.time, createjs.Ease.cubicInOut)
            .moveSmooth(':', new THREE.Vector3(this.space, - this.basePos, 0), this.margin, this.time, createjs.Ease.cubicInOut)
            .moveSmooth(sh,  new THREE.Vector3(2 * this.space, - this.basePos, 0), this.margin, this.time, createjs.Ease.cubicInOut)
            .moveSmooth(sl,  new THREE.Vector3(3 * this.space, - this.basePos, 0), this.margin, this.time, createjs.Ease.cubicInOut)
            .circleMove(new THREE.Vector3(this.basePos, 0, 0), 4 * this.space, 1000, createjs.Ease.cubicInOut);

        setTimeout(this.animation, this.time);
    }
}


window.onload = () => {
    var target = document.querySelector("#viewport");
    var cd = new CubeDraw();

    var ld = new LoopDrawing(cd, window, target);
    ld.draw();
};