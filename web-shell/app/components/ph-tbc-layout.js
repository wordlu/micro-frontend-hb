import Component from "@glimmer/component"
import { inject as service } from "@ember/service"
import { action } from "@ember/object"

export default class PhTbcLayoutComponent extends Component {
	@service router
	@service("route-parse") rps

	get isLogin() {
		// TODO: 通过token，cookies去判断
		return false
	}

	get inverse() {
		return this.needInverse.includes(this.activeRoute)
	}

	get needInverse() {
		return [
			"max",
			"rw",
			"consulting",
			"activity-list",
			"about-us",
			"report-list",
			"boyunhui",
			"download-report",
			"above-data-detail",
			"industry-activity-detail"
		]
	}

	get activeRoute() {
		let path = this.router.currentRoute.params.path
		path = this.rps.queryLogicControllerName(path)
		return path
	}

	get navComponent() {
		if (this.args.navComponent) {
			return this.args.navComponent
		} else return "pharbers-bp-nav-top"
	}

	get footComponent() {
		if (this.args.footComponent) {
			return this.args.footComponent
		} else return "pharbers-bp-page-bottom"
	}

	@action
	linkToPage(data) {
		if (data.detail[0] == "home" && this.router.currentRouteName == "home") {
			window.location.reload()
		} else {
			this.router.transitionTo("shell", data.detail[0])
		}
	}

	@action
	logout() {
		this.oauthService.removeAuth()
	}
}
