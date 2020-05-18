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
        this.refreshUI();
    }
    // 游戏自身相关数据
    data = {
        status: 0, // 游戏状态 0 未开始,1进行中,2成功,3失败
        killCount: 0, // 杀敌数
        totalScore: 0, // 总分
        score: {
            enemyPlane: 10 // 每个敌机多少分
        }
    }
    //敌机工厂 
    enemyPlaneFactory = () => {
        const { speed, blood } = this.props;
        this.intervalEnemyPlaneFactory = setInterval(()=>{
            if(this.data.status===2 || this.data.status===3) {
                // 闯关成功或失败
                window.clearInterval(this.intervalEnemyPlaneFactory);
            }
            //创建敌机
            new EnemyPlane({
                blood: blood,
                speed: speed,
                gameData: this.data,
                target: this.PlayerPlane,
                setGameData: this.setData
            });
        },1200);
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
            shotEnabled: true,
            contrlEnabled: true,
            gameData: this.data,
            setGameData: this.setData
        });
        // 批量生产敌机
        this.enemyPlaneFactory();
    }
}

// 实例化游戏 
new Game({
    speed: 10,
    blood: 10,
});