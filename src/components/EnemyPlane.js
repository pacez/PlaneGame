import Plane from './Plane';

/**
 * 敌机类
 *
 * @class EnemyPlane
 * @extends {Plane}
 */
export default class EnemyPlane extends Plane {
    constructor(props) {
        super(props);
        this.ready();
    }

    planeTypeMap = {
        'normal': 'enemy-plane',
        'leader': 'leader-plane',
        'boss': 'boss-plane',
    }

    ready = () => {
        // 初始化玩家飞机位置，缓存飞机属性
        const { type = 'normal' } =  this.props;
        // 根据type，添加不同的class，以实现不同种类敌机。
        this.plane.classList.add(this.planeTypeMap[type]);

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
        // 此处碰撞检查，以两个方型元素为检查项。
        // 当前元素，坐标，尺寸
        const { y, x } = this.position;
        const { height, width } = this.attrbutes;
        // 目标元素，坐标，尺寸
        const { y: target_y, x: target_x } = target.position;
        const { height: target_height, width: target_width } = target.attrbutes;

        const isCrossY = (y + height >= target_y && y <= target_y + target_height)  // Y轴交叉
        const isCrossX = (x + width >= target_x && x <= target_x + target_width)  // X轴交叉

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
            // 飞机碰撞检查 || 或者游戏失败
            if (this.isCrash(target) || gameData.status===3) {
                // 销毁敌机
                this.destory();
                // 销毁玩家飞机
                target.destory();
                return 
            }

            // 被子弹击中检测
            if (bullets.length > 0) {
                let { plane } = this; 
                bullets.find((bullet,index) => {
                    if (this.isCrash(bullet)) {
                        this.blood -= 1;
                        // 击中效果
                        plane.classList.add('hit');

                        // 延时移除击中效果
                        setTimeout(() => {
                            plane.classList.remove('hit');
                        }, 500);

                        if(this.blood<=0) {
                            // 血量清0时，被击毁。
                            this.destory({
                                isCount: true,
                                isHit: true
                            });
                        }
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
            const { gameData, setGameData, score=10 } = this.props;
            const { killCount, totalScore } = gameData;
            setGameData('killCount', killCount + 1);
            setGameData('totalScore', totalScore + score );
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