import Component from "@glimmer/component"
import { action } from "@ember/object"
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking'
import { camelize } from "@ember/string"
import ENV from "web-shell/config/environment"


export default class IframeContextComponent extends Component {
	@service router
	@service store
	@service cookies
	@service awsService
	@service downloadFile
    // @service noticeService;
    @service('loading') loadingService
	@service("execution-status") noticeService
	@tracked allData

	get environment() {
		return ENV.environment
	}

	@action
	async listener(e) {
		let modelName = camelize(this.args.allData.page.name) + "EventHandler"
		await window[this.args.allData.page.clientName][modelName](e, this)
	}

	@action
	iframeEvent(event) {
		console.log("ember接受iframe消息", event)
		if(event.data.message) {
			let jobNamePre = event.data.message.notification.id.split("_")
			jobNamePre.pop()
			jobNamePre = jobNamePre.join("_")
			//dag实时
			this.noticeService.defineAction({
				type: "iot",
				remoteResource: "notification",
				runnerId: "",
				id: event.data.message.notification.id,
				eventName: event.data.message.notification.eventName,
				projectId: jobNamePre,
				ownerId: this.cookies.read("account_id"),
				callBack: this.runDagCallback
			})

			//dag整体
			this.noticeService.defineAction({
				type: "iot",
				remoteResource: "notification",
				runnerId: "",
				id: event.data.message.executionStatus.id,
				eventName: event.data.message.executionStatus.eventName,
				projectId: this.args.allData.data.projectId, // event.data.message.executionStatus.projectId
				ownerId: this.cookies.read("account_id"),
				callBack: this.executionStatusCallback
			})
		}
	}

	@action
	executionStatusCallback(param, payload) {
		console.log("dag整体callback")
		console.log(payload)
		console.log(param)
		let obj = {
			param,
			payload,
			cmd: "finish_dag"
		}
		// 向iframe传递消息
		document.getElementById("mainIframe").contentWindow.postMessage({
			message: obj
		}, '*')
	}

	@action
	runDagCallback(param, payload) {
		console.log("dag实时callback")
		console.log(payload)
		console.log(param)
		let obj = {
			param,
			payload,
			cmd: "render_dag"
		}
		// 向iframe传递消息
		document.getElementById("mainIframe").contentWindow.postMessage({
			message: obj
		}, '*')
	}

	@action
	async registerListener(element) {
		window.addEventListener('message', this.iframeEvent)
		this.args.allData.data._isVue = true
		element.allData = this.args.allData.data
		console.log(element.allData)
		element.addEventListener("event", this.listener)
		document.domain = "hubadata.com"
	}

	@action
	unregisterListener(element) {
		element.removeEventListener("event", this.listener)
	}
}
