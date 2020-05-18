import Bullet from './Bullet';

/**
 * 飞机基类，敌机，玩家飞机基于此扩展
 *
 * @export
 * @class Plane
 */
export default class Plane {


    /**
     *Creates an instance of Plane.
     * @param {{uuid:Number}} props
     * @memberof Plane
     */
    constructor(props) {
        this.props = props;
        this.props.uuid = `plane${new Date().getTime()}`;
        this.mainDiv = document.body;
        this.mainHeight = document.body.offsetHeight; //main的高度
        this.mainWidth = document.body.offsetWidth; //main的宽度
        this.mainTop = 0; //当前main盒子距离top
        this.init();
    }

    init = (cb) => {
        const { uuid } = this.props;
        this.plane = document.createElement("div");
        this.plane.className = `plane`;
        this.plane.id = uuid;
        this.plane.style.position = "absolute";
        this.plane.style.visibility = "hidden";
        document.body.appendChild(this.plane);
    }

    setPosition = (x = 0, y = 0) => {
        this.plane.style.left = x + 'px';;
        this.plane.style.top = y + 'px';
        this.position = {x,y}
    }

    // 子弹队列
    bullets = []
    intervalFire = null;

    // 发射子弹
    sendBullet = () => {
        const y = this.plane.offsetTop;
        const x = this.plane.offsetLeft + this.attrbutes.width / 2;
        this.bullets.push(new Bullet({
            startPoint: { x, y }
        }))
    }

    // 开火
    fire = () => {
        if (this.intervalFire===null) {
            this.intervalFire = setInterval(() => {
                this.sendBullet();
                console.log('fire...')
            }, 200);
        }
    }

    // 停止开火
    stopFire = () => {
        window.clearInterval(this.intervalFire);
        this.intervalFire = null;
        console.log('stop fire...')
    }

    clearAllInterval = () => {
        this.stopFire();
    }
 }