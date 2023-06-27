const path = require('path')

module.exports = {
    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-svg-inline-loader')
            .loader('vue-svg-inline-loader') // in your project
            .options({ /* ... */ })
        config.module
            .rule("thejs")
            .test(/\.js$/)
            .include.add(path.resolve("src"))
            .add(path.resolve("node_modules/element-ui/packages"))
            .end()
            .use("babel-loader")
            .loader("babel-loader")
            .end();
    },
    devServer: {
        disableHostCheck: true
    }
}
