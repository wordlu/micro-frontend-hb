import Service from "@ember/service"
import ENV from "web-shell/config/environment"
import { inject as service } from "@ember/service"

export default class PhMenuService extends Service {
	@service store

	// 分离测试环境
	get queryClientId() {
		if (ENV.environment === "development") {
			return ENV.APP.clientId + "_dev"
		} else {
			return ENV.APP.clientId
		}
	}

	async queryLayoutByClient() {
		let layout = this.store.peekRecord("layout", this.queryClientId)
		if (layout === null) {
			layout = await this.store.findRecord("layout", this.queryClientId)
		}
		return layout
	}

	async queryClientPages() {
		let pages = this.store.peekAll("page")
		pages = pages.filter((_) => true)
		if (pages.length === 0) {
			pages = await this.store.query("page", {
				"filter[clientId]": this.queryClientId
			})
			pages = pages.filter((_) => true)
		}
		return pages
	}
}
