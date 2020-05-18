# PlaneGame
打飞机小游戏，教学使用，主要用于培养前端开发人员，基于ES6类的概念，进行面向对象编辑思维训练。

1. 安装依赖：yarn  或者 npm i 
2. 开发服务：yarn dev 或者 npm run 


### 思考步骤：
#### STEP 1 将打飞机游戏，抽象对象概念：
1. 抽象类：游戏本身。
1. 实体类：飞机，子弹。
1. 基于飞机扩展类的： 敌机，玩家飞机

#### STEP 2 思考对象大概的属性与方法实现，思考逻辑关联。
1. 游戏类：游戏数据（杀敌数，总得分）
2. 子弹类：创建子弹，设置并缓存子弹基本属性（位置 ，尺寸），具备设置子弹位置，销毁方法。
3. 飞机类：创建飞机，设置并缓存飞机基本属性（位置 ，尺寸），具备设置飞机位置，开火，停火，销毁方法。  开火，停火能力，通过创建子弹实例实现。
4. 玩家飞机：基于飞机类扩展，具备飞机类所有能力与属性，私有方法：控制飞机方向方法实现，火控方法（开火、停火触发方法），销毁方法，
5. 敌机飞机：基于飞机类扩展，具备飞机类所有能力与属性，私有方法：碰撞检测方法-（检测撞毁玩家飞机，检测被玩家飞机子弹击中），销毁方法
