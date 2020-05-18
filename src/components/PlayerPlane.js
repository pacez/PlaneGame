import Plane from './Plane';

/**
 *
 *
 * @class PlayerPlane
 * @extends {Plane}
 */
export default class PlayerPlane extends Plane {

    interval = null;

    keyStatus = {
        left: false,
        right: false,
        top: false,
        bottom: false
    }

    keyMaps = {
        37: 'left',
        39: 'right',
        38: 'top',
        40: 'bottom'
    }

    directionMaps = {
        left: 37,
        right: 39,
        top: 38,
        bottom: 40
    }

    constructor(props) {
        super(props);
        this.ready();
    }

    ready = () => {
        // 初始化玩家飞机位置，缓存飞机属性
        this.plane.classList.add('player-plane');
        this.plane.style.visibility = 'visible';
        this.attrbutes = {
            width: parseInt(this.plane.offsetWidth,10),
            height: parseInt(this.plane.offsetHeight,10),
        }
        this.setPosition((this.mainWidth - this.attrbutes.width) / 2, this.mainHeight - this.attrbutes.height - 20);
        this.initControllerKeyboard();
    }

    move = (keyCode, config = {}) => {
        let x = 0,
            y = 0;
        const { limitArea, overDestory } = config;
        const { speed } = this.props;
        const C_X = this.plane.offsetLeft;
        const C_Y = this.plane.offsetTop;
        const { height, width } = this.attrbutes;

        //38-上 40-下 37-左 39-右
        if (this.keyMaps[keyCode] == 'top') {
            y -= speed;
            if (C_Y + y <= 0) {
                if (limitArea) {
                    y = 0;
                }
            }
        }
        if (this.keyMaps[keyCode] == 'bottom') {
            y += speed
            if (C_Y + y + height >= this.mainHeight) {
                // 向下超出显示区
                if (limitArea) {
                    // 超出不位移
                    y = 0;
                }
            }
        }
        if (this.keyMaps[keyCode] == 'left') {
            x -= speed
            if (C_X + x <= 0) {
                if (limitArea) {
                    x = 0;
                }
            }
        }
        if (this.keyMaps[keyCode] == 'right') {
            x += speed;
            if (C_X + x + width >= this.mainWidth) {
                x = 0;
            }
        }

        this.setPosition(C_X + x, C_Y + y);
    }

    createIntervalMove = () => {
        if (this.interval === null) {
            this.interval = setInterval(() => {
                for (var i in this.keyStatus) {
                    const active = this.keyStatus[i]
                    if (active) {
                        this.move(this.directionMaps[i], {
                            limitArea: true
                        });
                    }
                }
            }, 50)
        }
    }

    clearIntervalAction = () => {
        window.clearInterval(this.interval);
        this.interval = null
    }

    clearIntervalMove = () => {
        let flag = true;
        for (var i in this.keyStatus) {
            const active = this.keyStatus[i]
            if (active) {
                flag = false;
            }
        }
        if (flag) {
            this.clearIntervalAction();
        }
    }

    keydown = (e) => {
        const { shotEnabled, contrlEnabled } = this.props;
        const keyCode = e.keyCode;
        if (contrlEnabled) {
            // 开启飞机方向控制，开始移动
            this.createIntervalMove();
            const direction = this.keyMaps[keyCode];
            if (direction) {
                this.keyStatus[direction] = true;
            }
        }

        if (shotEnabled && keyCode == 32) {
            // 启动开火, 开始射击
            this.fire();
            console.log('fire')
        }
    }

    keyup = (e) => {
        const { shotEnabled, contrlEnabled } = this.props;
        const keyCode = e.keyCode;
        if (contrlEnabled) {
            // 开启飞机方向控制，停止移动
            const direction = this.keyMaps[keyCode];
            if (direction) {
                this.keyStatus[direction] = false;
            }
            this.clearIntervalMove();
        }

        if (shotEnabled && keyCode == 32) {
            // 启动开火，停止射击
            this.stopFire()
            console.log('stopFire')
        }
    }

    initControllerKeyboard = () => {
        document.addEventListener('keydown', this.keydown);
        document.addEventListener('keyup', this.keyup)
    }

    destory = () => {
        // 清理定时器
        this.clearIntervalAction();
        // 解绑事件
        document.removeEventListener('keydown', this.keydown);
        document.removeEventListener('keyup', this.keyup);
        this.plane.classList.add('die');
        const { setGameData, gameData } = this.props;
        setGameData('status',3);
    }

}