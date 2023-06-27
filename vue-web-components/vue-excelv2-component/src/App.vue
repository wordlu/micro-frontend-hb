<template>
    <div id="app">
        <phExcelContainer />
    </div>
</template>

<script>
import phExcelContainer from './components/ph-excel-container.vue'

export default {
    name: 'App',
    components: {
        phExcelContainer
    }
}
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
</style>
