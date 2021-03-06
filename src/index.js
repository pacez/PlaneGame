import './style.scss';
import PlayerPlane from './components/PlayerPlane';
import EnemyPlane from './components/EnemyPlane';

/**
 * 游戏类，包含游戏基本数据信息。基础事件绑定。
 *
 * @class Game
 */
class Game {
    /**
     *Creates an instance of Game.
     * @param {*} props
     * @memberof Game
     */
    constructor(props) {
        this.props = props;
        this.init();
    }
    init = () => {
        this.bindEvent();
    }
    bindEvent = () => {
        /* 点击游戏开始。 */
        document.querySelector("#startBtn").addEventListener('click', () => {
            this.startGame();
        });
    }
    // 根据游戏数据刷新UI上数据变化
    refreshUI = () => {
        document.getElementById('killCount').innerHTML = this.data.killCount;
        document.getElementById('totalScore').innerHTML = this.data.totalScore;
    }
    // 设置游戏数据
    setData = (key,value) => {
        this.data[key] = value;
    }
    // 游戏自身相关数据
    data = {
        status: 0, // 游戏状态 0 未开始,1进行中,2成功,3失败
        killCount: 0, // 杀敌数
        totalScore: 0, // 总分
    }

    // 敌机被摧毁时
    destoryEnemyPlane = (score) => {
        // 游戏加分，加杀敌数，刷新UI
        let { killCount, totalScore } = this.data;
        this.setData('killCount', killCount += 1);
        this.setData('totalScore', totalScore += score);
        this.refreshUI();
    }

    // 玩家飞机被摧毁时
    destoryPlayerPlane = () => {
        // 将游戏状态改为结束，不再生产新的敌机。
        this.setData('status', 3);
    }

    // 游戏结束
    gameOver = () => {
        // 不再生产新敌机
        window.clearInterval(this.intervalEnemyPlaneFactory);
    }

    //敌机工厂 
    enemyPlaneFactory = () => {
        const { speed, blood } = this.props;
        let leaderCreateCount = 0; // leader出现时机计数器
        let bossCreateCount = 0; // boss出现时机计数器
        // 每秒生产一架敌机
        this.intervalEnemyPlaneFactory = setInterval(() => {
            const { status } = this.data;
            leaderCreateCount += 1;
            if(status===2 || status===3) {
                // 闯关成功或失败
                this.gameOver();
            }
            //创建敌机
            if (leaderCreateCount % 5 === 0 && leaderCreateCount > 0) {
                bossCreateCount += 1;
                if (bossCreateCount % 5 === 0 && bossCreateCount > 0) {
                    // 每生产4只中型敌机，产生一只BOSS敌机
                    new EnemyPlane({
                        blood: blood * 10, // BOSS敌机的血量是普通敌机的5倍
                        speed: speed * .8, // BOSS敌机的速度是普通敌机的.8倍
                        score: 100, // 击中一个多少分，默认10分
                        type: 'boss', //type: normal,leader,boss
                        target: this.PlayerPlane, // 打击目标
                        destory: this.destoryEnemyPlane // 敌机被击毁时的回调方法
                    });
                    return 
                }
                // 每生产4只普通敌机，产生一只中型敌机
                new EnemyPlane({
                    blood: blood * 5, // 中型敌机的血量是普通敌机的3倍
                    speed: speed*1.2, // 中型敌机的速度是普通敌机的1.2倍
                    score: 30, // 击中一个多少分，默认10分
                    type: 'leader', //type: normal,leader,boss
                    target: this.PlayerPlane, // 打击目标
                    destory: this.destoryEnemyPlane // 敌机被击毁时的回调方法
                });
                return
            } 
            // 普通敌机
            new EnemyPlane({
                blood: blood, // 血量
                speed: speed, // 速度 
                target: this.PlayerPlane, // 打击目标
                destory: this.destoryEnemyPlane // 敌机被击毁时的回调方法
            });
        },1000);
    }
    /* 游戏开始 */
    startGame = () => {
        const { speed, blood } = this.props;
        // 隐藏不必要的元素
        document.body.classList.add('start');
        //创建玩家飞机
        this.PlayerPlane = new PlayerPlane({
            blood: blood,
            speed: speed,
            destory: this.destoryPlayerPlane // 被击毁时的回调方法
        });
        // 批量生产敌机
        this.enemyPlaneFactory();
    }
}

// 实例化游戏 
new Game({
    speed: 10, // 敌机基准速度，不同种类，倍率不一样。
    blood: 1, // 敌机基准血量，不同种类，倍率不一样。
});