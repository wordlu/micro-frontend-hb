<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<style lang="scss">
    #app {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        height: 100vh;
    }
    body {
        margin: 0;
        padding: 0;
        font-family: system,-apple-system,BlinkMacSystemFont,"PingFang SC","Hiragino Sans GB","Segoe UI",Roboto,"Microsoft YaHei","Helvetica Neue",Helvetica,Arial,sans-serif;
        box-sizing: border-box;
    }
</style>
