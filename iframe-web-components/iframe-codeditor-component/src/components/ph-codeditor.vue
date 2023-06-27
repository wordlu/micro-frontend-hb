<template>
<div class="ace-container" :style="style">
    <!-- import CSS -->
    <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
    <!-- 官方文档中使用 id，这里禁止使用，在后期打包后容易出现问题，使用 ref 或者 DOM 就行 -->
    <div class="ace-editor" ref="ace" ></div>
</div>

</template>

<script>
// import { cloneDeep } from 'utils/tools'

import PhCodeEditorHandler from './handler/codeeditorhandler'

export default {
    name: 'ph-codeditor',
    model: {
        event: 'change'
    },
    components: {

    },
    computed: {
        style: function() {
            let viewHeight = this.viewHeight
            return "height: " + viewHeight
        }
    },
    data() {
        return {
            editorInstance: null,
            isVisible: false,
            dialogValue: "",
            editorId: "ace-editor",
            viewHeight: "600px",
            withFullscreenBtn: false, // 是否显示全屏按钮
            withFooterBtns: false
        }
    },
    mounted() {
        this.registerEvent()
    },
    watch: {
    },
    methods: {
        registerEvent() {
            this.unRegisterEvent()
            // 注册初始化Editor事件
            window.addEventListener("message", this.initEditor);
            // 注册返回编辑器内容事件
            window.addEventListener("message", this.returnContent);
            // 注册设置编辑器内容事件
            window.addEventListener("message", this.setValue);
            // window.addEventListener("message", this.destroy);
        },
        unRegisterEvent() {
            window.removeEventListener("message", this.initEditor);
            window.removeEventListener("message", this.returnContent);
            window.removeEventListener("message", this.setValue);
            // window.removeEventListener("message", this.destroy);
        },
        initEditor(event) {
            if (event.data.codeEditorParameters) {
                const {
                    editorId,
                    // value,
                    viewHeight,
                    language,
                    maxLines,
                    theme
                } = event.data.codeEditorParameters

                this.viewHeight = viewHeight
                this.editorId = editorId
                console.debug(`register editorId: ${editorId}`)

                this.editorInstance = new PhCodeEditorHandler(
                    this.$refs.ace,
                    theme,
                    language,
                    maxLines
                )

                this.editorInstance.setEditorOptions({
                    // value: value,
                    fontSize: 14,
                    tabSize: 4,
                    readOnly: false,
                    selectionStyle: "text",
                    enableBasicAutocompletion: true,
                    enableSnippets: true,
                    enableLiveAutocompletion: true,
                    wrap: true,
                    autoScrollEditorIntoView: true,
                    setShowPrintMargin: false
                })

                window.parent.postMessage({
                    editorStaus: "complete"
                }, '*')
            }
        },
        setValue(event) {
            if (this.editorInstance && event.data.codeValue) {
                this.editorInstance.setEditorOptions({
                    value: event.data.codeValue
                })
            }
        },
        returnContent(event) {
            if (event.data.getValue) {
                const value = this.editorInstance.outContent()
                window.parent.postMessage({
                    editorId: this.editorId,
                    content: value
                }, '*')
            }
        },
        // 实例方法，高亮某一行
        gotoLine(lineNumber) {
            if (this.editorInstance) {
                this.editorInstance.gotoLine(lineNumber)
            }
        },
        // 全屏编辑
        fullscreen() {
            // this.dialogValue = cloneDeep(this.editor.getValue())
            // this.isVisible = true
        },
        closeEditCode() {
            this.editorInstance.setValue(this.dialogValue)
            this.editorInstance.clearSelection()
        },
        // resize编辑器
        resize() {
            this.editorInstance.resize(true)
        },
        destroy() {
            // if (this.editorInstance !== null) {
            //     this.unRegisterEvent()
            //     console.info("destroy")
            //     this.editorInstance.destroy()
            //     this.editorInstance = null
            // }
            this.unRegisterEvent()
            console.info("destroy")
            this.editorInstance.destroy()
            this.editorInstance = null
        }
    },
    destroyed() {
        this.destroy()
    },
    beforeDestroy() {
        // TODO: 销毁这边可能有问题,第一版出来我在想想
        this.destroy()
    }
}
</script>

<style lang='scss' scoped>
.ace-container {
    position: relative;

    .ace-editor {
        position: absolute;
        inset: 7px 0 0;
        min-height: 100%;
    }

}
</style>
