const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const isDev = process.env.NODE_ENV == 'development'

const config = {

    target: 'web',

    entry: path.join(__dirname, "src/index.js"), //输入文件

    output: {
        filename: "build.js", //输出文件
        path: path.join(__dirname, 'dist') //输出路径
    },

    module: {

        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/transform-runtime', '@babel/plugin-proposal-class-properties']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader" // 将 JS 字符串生成为 style 节点
                }, {
                    loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
                }, {
                    loader: "sass-loader" // 将 Sass 编译成 CSS
                }]
            },
            {

                test: /\.(gif|png|jpg|jpeg|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1024,
                        name: '[name]-[hash].[ext]'
                    }

                }]

            },

        ]

    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"',
            }

        }),

        new HTMLPlugin({
            minify: { // 压缩HTML文件
                removeComments: true, // 移除HTML中的注释
                collapseWhitespace: true, // 删除空白符与换行符
                minifyCSS: true// 压缩内联css
            },
            filename: 'index.html',
            template: './src/index.html'
        }),

    ],



}

if (isDev) {

    config.devtool = '#cheap-module-eval-source-map',
    config.devServer = {
        port: 8000,
        overlay: {
            errors: true
        },
        open:true,  
        hot: true

    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
    )

}

module.exports = config