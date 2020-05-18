
/**
 * 子弹类
 *
 * @export
 * @class Bullet
 */
export default class Bullet {

    constructor(props) {
        this.props = props;
        this.init();
    }

    // 初始化子弹
    init = () => {
        this.bullet = document.createElement('div');
        this.bullet.className = 'bullet';
        document.body.append(this.bullet)
        this.initPosition();
    }

    // 定义子弹初始位置，并缓存一些基本属性
    initPosition = () => {
        const { startPoint } = this.props;
        const width = parseInt(this.bullet.offsetWidth, 10);
        const height = parseInt(this.bullet.offsetHeight, 10);
        this.attrbutes = {
            width,
            height
        };
        const x = startPoint.x - width/2;
        const y = startPoint.y - height;
        this.setPosition(x,y);
        this.bullet.style.visibility = 'visible';
        this.intervalMove();
    }

    // 设置子弹位置，并缓存位置信息
    setPosition = (x, y) => {
        this.bullet.style.left = x + 'px';
        this.bullet.style.top = y + 'px';
        this.position = {
            x, y
        }
    }

    // 子弹持续移动
    intervalMove = () => {
        const { speed = 20 } = this.props;
        this.interval = setInterval(() => {
            let { x,y } = this.position;
            this.setPosition(x, y - speed);
            if (y <= 0) {
                this.destory();
            }
        }, 100);
    }

    // 销毁子弹，移除循环位移方法
    destory = () => {
        window.clearInterval(this.interval);
        this.interval = null;
        document.body.removeChild(this.bullet);
    } 
}