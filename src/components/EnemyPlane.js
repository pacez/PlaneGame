import Plane from './Plane';
import Bullet from './Bullet';

/**
 *
 *
 * @class EnemyPlane
 * @extends {Plane}
 */
export default class EnemyPlane extends Plane {
    constructor(props) {
        super(props);
        this.ready();
    }

    ready = () => {
        // 初始化玩家飞机位置，缓存飞机属性
        this.plane.classList.add('enemy-plane');
        this.plane.style.visibility = 'visible';
        this.attrbutes = {
            width: parseInt(this.plane.offsetWidth, 10),
            height: parseInt(this.plane.offsetHeight, 10),
        }
        let x = (this.mainWidth - this.attrbutes.width) * Math.random();
        // 设置初始位置 
        this.setPosition(parseInt(x,10), 0);
        // 设置移动
        this.moving();
        // 设置碰撞检测
        this.crashChecking();
    }

    intervalMove = null // 移动定时器
    intervalTargetCrash= null  // 目标飞机碰撞检查定时器
    intervalBulletCrash = null // 子弹碰撞检查定时器

    // 碰撞检测
    isCrash = (target) => {
        // const { target } = this.props;
        // 当前元素，坐标，尺寸
        var current_y = this.position.y;
        var current_x = this.position.x;
        var current_height = this.attrbutes.height;
        var current_width = this.attrbutes.width;
        // 目标元素，坐标，尺寸
        var target_y = target.position.y;
        var target_x = target.position.x;
        var target_height = target.attrbutes.height;
        var target_width = target.attrbutes.width;

        const isCrossY = (current_y + current_height >= target_y && current_y <= target_y + target_height)  // Y轴交叉
        const isCrossX = (current_x + current_width >= target_x && current_x <= target_x + target_width)  // X轴交叉

        if (isCrossY && isCrossX) {
            // 撞上了
            return true
        }

        return false
    }

    // 碰撞侦测
    crashChecking = () => {
        // 目标飞机碰撞检测
        const { target, gameData } = this.props;
        const bullets = target.bullets;
        this.intervalTargetCrash = setInterval(() => {
            // 飞机碰撞检查
            if (this.isCrash(target) || gameData.status===3) {
                // 销毁敌机
                this.destory();
                // 销毁玩家飞机
                target.destory();
            }

            // 被子弹击中检测
            if (bullets.length > 0) {
                bullets.find((bullet,index) => {
                    if (this.isCrash(bullet)) {
                        this.destory({
                            isCount: true,
                            isHit: true
                        });
                        bullet.destory();
                        // 一定要记得从子弹队列中移除，否则循环时报错
                        bullets.splice(index,1);
                        return true
                    }
                });
            }
        }, 100);
    }

    // 销毁敌机
    destory = (options = {}) => {
        const { isCount = false, isHit = false } = options;
        window.clearInterval(this.intervalMove);
        window.clearInterval(this.intervalTargetCrash);

        if (isHit) {
            // 命中目标
            this.plane.classList.add('die');
        } 

        // 命中延时700ms移除敌机
        setTimeout(() => {
            document.body.removeChild(this.plane);
        }, isHit ? 700 : 0);


        if (isCount) {
            // 销毁时是否计算分值等
            const { gameData, setGameData } = this.props;
            const { killCount, totalScore, score } = gameData;
            setGameData('killCount', killCount + 1);
            setGameData('totalScore', totalScore + score.enemyPlane);
        }
    }

    // 敌机移动中
    moving = () => {
        this.intervalMove = setInterval(()=>{
            const { y } = this.position;
            const { speed } = this.props;
            const target_y = y+speed;

            if(target_y + this.attrbutes.height >=  this.mainHeight) {
                this.destory();
                return
            }

            this.setPosition(this.position.x,this.position.y+this.props.speed);
        },100);
    }
}