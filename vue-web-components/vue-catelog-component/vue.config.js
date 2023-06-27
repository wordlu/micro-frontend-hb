const { join } = require('path')
const path = require('path')

module.exports = {
    chainWebpack: config => {
        config.module.rule("thejs")
            .test(/\.js$/)
            .include.add(path.resolve("src"))
            .add(path.resolve("node_modules/element-ui/packages"))
            .end()
            .use("babel-loader")
            .loader("babel-loader")
            .end();
        // config.module.rule('vue')
        // 	.uses.clear()
        // 	.use('vue-svg-inline-loader')
        // 	.loader('vue-svg-inline-loader')
        // 	.options({ /* ... */ })
    },
    devServer: {
        disableHostCheck: true
    }
}
