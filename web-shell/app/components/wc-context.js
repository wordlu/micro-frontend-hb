import Component from "@glimmer/component"
import { action } from "@ember/object"
import { inject as service } from "@ember/service"
import { camelize } from "@ember/string"
import ENV from "web-shell/config/environment"

export default class WcContextComponent extends Component {
	@service router
	@service store
	@service cookies
	@service awsService
	@service downloadFile
	// @service noticeService;
	@service("loading") loadingService
	@service("resource-action-service") resourceActionService
	@service("execution-status") noticeService

	get maxResourceNumber() {
		return ENV.APP.maxResourceNumber
	}

	@action
	async listener(e) {
		let modelName = camelize(this.args.allData.page.name) + "EventHandler"
		await window[this.args.allData.page.clientName][modelName](e, this)
	}

	@action
	async registerListener(element) {
		// this.args.allData.data._isVue = true
		element.allData = this.args.allData.data
		console.log(element.allData)
		element.addEventListener("event", this.listener)
	}

	@action
	unregisterListener(element) {
		element.removeEventListener("event", this.listener)
	}
}
