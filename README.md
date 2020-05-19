# PlaneGame
打飞机小游戏，主要用于培养前端工程师面向对象编辑思维，基于ES6类的概念实现。
请使用chrome移动设备模拟窗口查看。

本游戏除了加载es6必要的babel运行时，不依赖第三方功能性库。

<img src="https://raw.githubusercontent.com/pacez/PlaneGame/master/doc/preview.png" height = "360" />


### 开发：
1. 安装依赖：yarn  或者 npm i 
1. 启动服务：yarn dev 或者 npm run dev

执行完，会自动打开浏览器进行开发预览页面

### 构建：
1. 构建命令：yarn build 或者 npm run build

构建完，会在根目录下生成用于生产环境的dist目录。


### 思考步骤：
#### STEP 1： 将打飞机游戏，抽象对象概念
1. 抽象类：游戏本身。
1. 实体类：飞机，子弹。
1. 基于飞机的扩展类： 敌机，玩家飞机

#### STEP 2： 思考对象大概的属性与方法实现，思考逻辑关联。
1. 游戏类：游戏数据（杀敌数，总得分）
2. 子弹类：创建子弹，设置并缓存子弹基本属性（位置 ，尺寸），具备设置子弹位置，销毁方法。
3. 飞机类：创建飞机，设置并缓存飞机基本属性（位置 ，尺寸），具备设置飞机位置，开火，停火，销毁方法。  开火，停火能力，通过创建子弹实例实现。
4. 玩家飞机：基于飞机类扩展，具备飞机类所有能力与属性，私有方法：控制飞机方向方法实现，火控方法（开火、停火触发方法）,
5. 敌机飞机：基于飞机类扩展，具备飞机类所有能力与属性，私有属性：敌机类型，私有方法：碰撞检测（检测撞毁玩家飞机，检测被玩家飞机子弹击中）,

* 基本思路，依赖细节实现，需要大家多思考。