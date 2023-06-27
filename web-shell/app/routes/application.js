import { inject as service } from "@ember/service"
import { tracked } from "@glimmer/tracking"
import Route from "@ember/routing/route"
import { action } from "@ember/object"
import ENV from "web-shell/config/environment"

export default class ApplicationRoute extends Route {
	@service intl
	@service("loading") loadingService
	@service("ph-menu") menuService
    @service browserEventsService;
	@service("remote-loading") jsl

	get clientName() {
		return ENV.APP.clientName
	}

	beforeModel(param) {
		if(this.clientName === "project") {
			this.browserEventsService.clearBroListener()
			let name = this.loadBroswerEvent(param)
			if(name != "" ){
				this.browserEventsService.registerBroListener(name)	
			}
		}
		this.loadingService.beforeLoading()
	}

	@action
	willTransition(_) {
		this.loadingService.beforeLoading()
	}

	@action
	didTransition() {
		//跳转到页面顶部
		document.documentElement.scrollTop = 0
		document.body.scrollTop = 0
		this.loadingService.afterLoading()
	}
	
	@action
	loadBroswerEvent(data) {
		let routeValue = ""
		let urlName = window.location.href.split("?")[0]
		let name = urlName.split("/").pop()
		const scriptArray = ["prepare", "topn", "sync", "distinct", "join", "stack", "group", "prepare-set", "sort", "pivot"]
		if (name == "dataset") {
			routeValue = "dataset-lst"
		} else if (urlName.indexOf("/flow") > -1) {
			routeValue = "flow"
		} else if (scriptArray.indexOf(name) > -1) {
			routeValue = "recipes"
		}
		return routeValue
	}

	async model() {
		this.afterModel = function () {
			this.loadingService.afterLoading()
		}
		const layout = await this.menuService.queryLayoutByClient()
		if (layout.script !== null) {
			this.jsl.loadRemoteJs(layout.script)
		}

		// TODO: remote load css
		if (layout.css !== null) {

		}

		return layout
	}
}
