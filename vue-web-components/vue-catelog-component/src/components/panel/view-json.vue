<template>
<div class="json-area">
    <div class="json-data-area">
        <div class="header-area">
            <bp-text class="header-title">属性</bp-text>
            <img :src="closeIcon" class="icon-close" alt="" @click="closeJsonModel">
        </div>
        <div class="json-show">
            <JsonViewer :value="JsonData" copyable :expand-depth=5 :expanded="true"></JsonViewer>
        </div>
    </div>
</div>
</template>

<script>
import JsonViewer from 'vue-json-viewer'
import bpText from '../../../node_modules/vue-components/src/components/bp-text.vue'
import { staticFilePath } from '../../config/envConfig'

export default {
    components: {
        JsonViewer,
        bpText
    },
    data() {
        return {
            closeIcon: `${staticFilePath}` + "/icon_close.svg"
        }
    },
    props: {
        JsonData: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    computed: {},
    methods: {
        closeJsonModel() {
            this.$emit("closeJsonModal")
        }
    }
}
</script>

<style lang="scss">
* {
    box-sizing: border-box;
}

.json-area {
    height: 100vh;
    width: 100vw;
    background: rgba(37, 35, 45, 0.55);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9999;
    justify-content: center;
    align-items: center;

    .json-data-area {
        height: 500px;
        width: 600px;
        background: #FFFFFF;
        border-radius: 2px;
        overflow-y: auto;
    }

    .header-area {
        height: 56px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 20px 12px;

        .icon-close {
            cursor: pointer;
        }

        .header-title {
            font-family: SFProText-Regular;
            font-size: 16px;
            color: #25232D;
            letter-spacing: 0.25px;
            line-height: 24px;
            font-weight: 400;
        }
    }

    .json-show {
        margin: 20px;
        border: 1px solid #E1DFE9;
        border-radius: 2px;
        height: 404px;
        overflow-y: auto;
    }
}

.jv-node {
    position: relative
}

.jv-node:after {
    content: ","
}

.jv-node:last-of-type:after {
    content: ""
}

.jv-node.toggle {
    margin-left: 13px !important
}

.jv-node .jv-node {
    margin-left: 25px
}

.jv-container {
    box-sizing: border-box;
    position: relative
}

.jv-container.boxed {
    border: 1px solid #eee;
    border-radius: 6px
}

.jv-container.boxed:hover {
    box-shadow: 0 2px 7px rgba(0, 0, 0, .15);
    border-color: transparent;
    position: relative
}

.jv-container.jv-light {
    background: #fff;
    white-space: nowrap;
    color: #525252;
    font-size: 14px;
    font-family: Consolas, Menlo, Courier, monospace
}

.jv-ellipsis {
    color: #999;
    background-color: #eee;
    display: inline-block;
    line-height: .9;
    font-size: .9em;
    padding: 0 4px 2px;
    margin: 0 4px;
    border-radius: 3px;
    vertical-align: 2px;
    cursor: pointer;
    -webkit-user-select: none;
    user-select: none
}

.jv-button {
    color: #49b3ff
}

.jv-key {
    color: #111;
    margin-right: 4px
}

.jv-item.jv-array {
    color: #111
}

.jv-item.jv-boolean {
    color: #fc1e70
}

.jv-item.jv-function {
    color: #067bca
}

.jv-item.jv-number {
    color: #fc1e70
}

.jv-item.jv-object {
    color: #111
}

.jv-item.jv-undefined {
    color: #e08331
}

.jv-item.jv-string {
    color: #42b983;
    word-break: break-word;
    white-space: normal
}

.jv-item.jv-string .jv-link {
    color: #0366d6
}

.jv-code .jv-toggle:before {
    padding: 0 2px;
    border-radius: 2px
}

.jv-code .jv-toggle:hover:before {
    background: #eee
}

.jv-container .jv-code {
    overflow: hidden;
    padding: 30px 20px
}

.jv-container .jv-code.boxed {
    max-height: 300px
}

.jv-container .jv-code.open {
    max-height: none !important;
    overflow: visible;
    overflow-x: auto;
    padding-bottom: 45px
}

.jv-container .jv-toggle {
    background-image: url(data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjE2IiB3aWR0aD0iOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsPSIjNjY2IiBkPSJNMCAwbDggOC04IDh6Ii8+PC9zdmc+);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: 50%;
    cursor: pointer;
    width: 10px;
    height: 10px;
    margin-right: 2px;
    display: inline-block;
    -webkit-transition: -webkit-transform .1s;
    transition: -webkit-transform .1s;
    transition: transform .1s;
    transition: transform .1s, -webkit-transform .1s
}

.jv-container .jv-toggle.open {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg)
}

.jv-container .jv-more {
    position: absolute;
    z-index: 1;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    width: 100%;
    text-align: center;
    cursor: pointer
}

.jv-container .jv-more .jv-toggle {
    position: relative;
    top: 40%;
    z-index: 2;
    color: #888;
    -webkit-transition: all .1s;
    transition: all .1s;
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg)
}

.jv-container .jv-more .jv-toggle.open {
    -webkit-transform: rotate(-90deg);
    transform: rotate(-90deg)
}

.jv-container .jv-more:after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
    background: -webkit-linear-gradient(top, transparent 20%, hsla(0, 0%, 90.2%, .3));
    background: linear-gradient(180deg, transparent 20%, hsla(0, 0%, 90.2%, .3));
    -webkit-transition: all .1s;
    transition: all .1s
}

.jv-container .jv-more:hover .jv-toggle {
    top: 50%;
    color: #111
}

.jv-container .jv-more:hover:after {
    background: -webkit-linear-gradient(top, transparent 20%, hsla(0, 0%, 90.2%, .3));
    background: linear-gradient(180deg, transparent 20%, hsla(0, 0%, 90.2%, .3))
}

.jv-container .jv-button {
    position: relative;
    cursor: pointer;
    display: inline-block;
    padding: 5px;
    z-index: 5
}

.jv-container .jv-button.copied {
    opacity: .4;
    cursor: default
}

.jv-container .jv-tooltip {
    position: absolute
}

.jv-container .jv-tooltip.right {
    right: 15px
}

.jv-container .jv-tooltip.left {
    left: 15px
}

.jv-container .j-icon {
    font-size: 12px
}
</style>
