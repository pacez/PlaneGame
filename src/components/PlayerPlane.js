import Plane from './Plane';

/**
 * 玩家飞机类， 具备开火，停火，控制移动等方法
 *
 * @class PlayerPlane
 * @extends {Plane}
 */
export default class PlayerPlane extends Plane {

    interval = null;

    // 用于按键状态的标识，处理多方向键同时按住时，斜飞。
    keyStatus = {
        left: false,
        right: false,
        top: false,
        bottom: false
    }

    // keyCode与方向的影响
    keyMaps = {
        37: 'left',
        39: 'right',
        38: 'top',
        40: 'bottom'
    }

    // 方向与keyCode映射
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

    // 控制飞机移动的方法
    move = (keyCode) => {
        let x = 0,
            y = 0;
        const { speed } = this.props;
        const C_X = this.position.x;
        const C_Y = this.position.y;
        const { height, width } = this.attrbutes;

        //38-上 40-下 37-左 39-右
        if (this.keyMaps[keyCode] == 'top') {
            y -= speed;
            if (C_Y + y <= 0) {
                y = 0;
            }
        }
        if (this.keyMaps[keyCode] == 'bottom') {
            y += speed
            if (C_Y + y + height >= this.mainHeight) {
                y = 0;
            }
        }
        if (this.keyMaps[keyCode] == 'left') {
            x -= speed
            if (C_X + x <= 0) {
                x = 0;
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

    // 为满足多方向键同时控制方向，所以使用了定时器循环处理按键响应
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

    // 清理定时器
    clearIntervalAction = () => {
        window.clearInterval(this.interval);
        this.interval = null
    }

    // 处理按钮状态
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
        const keyCode = e.keyCode;
        // 开始移动
        this.createIntervalMove();
        const direction = this.keyMaps[keyCode];
        if (direction) {
            this.keyStatus[direction] = true;
        }

        if (keyCode == 32) {
            // 先发一颗，避免由于定时器产生的发射子弹延时
            this.sendBullet();
            // 启动开火, 开始射击
            this.fire();
            console.log('fire')
        }
    }

    keyup = (e) => {
        const keyCode = e.keyCode;
        //停止移动
        const direction = this.keyMaps[keyCode];
        if (direction) {
            this.keyStatus[direction] = false;
        }
        this.clearIntervalMove();

        if (keyCode == 32) {
            // 启动开火，停止射击
            this.stopFire()
            console.log('stopFire')
        }
    }

    // 注册按键事件
    initControllerKeyboard = () => {
        document.addEventListener('keydown', this.keydown);
        document.addEventListener('keyup', this.keyup)
    }

    // 摧毁自身
    destory = () => {
        // 清理定时器
        this.clearIntervalAction(); // 清除玩家飞机的自定义定时器
        this.clearAllInterval(); // 清除基于Plane的定时器
        // 解绑事件
        document.removeEventListener('keydown', this.keydown);
        document.removeEventListener('keyup', this.keyup);
        this.plane.classList.add('die');
        const { setGameData } = this.props;
        setGameData('status',3);
    }

}