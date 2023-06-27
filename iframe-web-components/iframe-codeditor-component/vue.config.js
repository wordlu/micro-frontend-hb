const path = require('path')

module.exports = {
    chainWebpack: (config) => {
        // config.output.filename("[name].[hash:8].js");
        // const types = ["vue-modules", "vue", "normal-modules", "normal"];
        // types.forEach((type) =>
        //     addStyleResource(config.module.rule("scss").oneOf(type))
        // );
        // config.module
        //     .rule("thejs")
        //     .test(/\.js$/)
        //     .include.add(path.resolve("src"))
        //     // .add(path.resolve("node_modules/ace-builds/src-noconflict"))
        //     .end()
        //     .use("babel-loader")
        //     .loader("babel-loader")
        //     .end();
    },
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {// 为生产环境修改配置...
            config.mode = 'production';
            config["performance"] = {//打包文件大小配置
                "maxEntrypointSize": 10000000,
                "maxAssetSize": 30000000
            }
        }
    },
    devServer: {
        disableHostCheck: true
    }
}


