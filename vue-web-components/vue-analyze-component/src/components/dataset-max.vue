<template>
    <div>
		<div class="header" style="height: 48px; background: #fff;display: flex; align-items: center; padding: 0 20px;">
			<img :src="img1" style="width: 24px; height: 24px; margin-right: 10px" alt="">
			<span class="datasetName">{{decodeURI(allData.datasetName)}}</span>
		</div>
		<div class="area" style="margin: 20px;">
			<div class="item">路径：{{allData.path}}</div>
			<div class="item" :style="{display: allData.display}">格式：{{allData.format}}</div>
			<div class="item" :style="{display: allData.display}">
				<button 
					style="width: 82px;height: 32px;background: #7163c5;font-family: PingFangSC-Medium;font-size: 14px;color: #fff;font-weight: 600;border:none;border-radius: 4px;margin-top:10px;cursor:pointer"
					@click="on_btn_click">
					下载</button>
			</div>
		</div>
    </div>
</template>

<script>
import { staticFilePath } from '../config/envConfig'

export default {
    data() {
        return {
            img1: `${staticFilePath}` + "/Database.svg"
        }
    },
    props: {
        allData: {
            type: Object,
            default: () => ({
                projectName: "项目名称",
                datasetName: "",
                path: "",
                cat: "",
                display: ""
            })
        }
    },
    methods: {
        on_btn_click() {
            const event = new Event("event")
            event.args = {
                callback: "downloadclick",
                element: this,
                param: {
                    name: "downloadclick",
                    path: this.allData.path
                }
            }
            this.$emit('event', event)
        }
    }
}
</script>

<style lang="scss" scoped>
* {
    padding: 0;
    margin: 0;
}
.datasetName {
	margin-left: 10px;
}
</style>