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

    // 初始化创建dom
    init = (cb) => {
        const { uuid,blood=1,className } = this.props;
        this.plane = document.createElement("div");
        this.plane.className = `plane`;
        this.plane.id = uuid;
        this.plane.style.visibility = "hidden";
        this.blood = blood;
        document.body.appendChild(this.plane);
        className && this.plane.classList.add(className);
        this.plane.style.visibility = 'visible';
        this.attrbutes = {
            width: parseInt(this.plane.offsetWidth, 10),
            height: parseInt(this.plane.offsetHeight, 10),
        }
    }

    // 设置飞机位置, 并缓存该位置
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
        const y = this.position.y;
        const x = this.position.x + this.attrbutes.width / 2;
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

    // 在销毁扩展实例时，清理基类的定时触发器。
    clearAllInterval = () => {
        this.stopFire();
    }
 }