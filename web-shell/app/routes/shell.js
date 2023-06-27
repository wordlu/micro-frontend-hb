import Route from "@ember/routing/route"
import { inject as service } from "@ember/service"
import RSVP from "rsvp"
import { camelize } from "@ember/string"
import ENV from "web-shell/config/environment"
import Model  from '@ember-data/model';

export default class ShellRoute extends Route {
	@service oauthService
	@service cookies
	@service store
	@service browserEventsService
	@service("remote-loading") jsl
	@service("route-parse") rps
	@service("ph-menu") ms
	@service("loading") loadingService
	@service("execution-status") noticeService

	get auth() {
		return ENV.APP.auth
	}

	get clientName() {
		return ENV.APP.clientName
	}

	get environment() {
		return ENV.environment
	}

	beforeModel(transition) {
		if (this.auth && !this.oauthService.judgeAuth()) {
			alert("登录过期，请重新登录")
			this.oauthService.obtainAuth()
		}
	}

	async model(params) {
		// if (Object.keys(params).length === 0) {
		// 	params["path"] = "home"
		// }

		/**
		 * 1. 第一步，需要从读取JS模版
		 */
		const pages = await this.ms.queryClientPages()
		const pageCount = pages.length
		let curPage = "" // not found page
		let parseParams
		for (let idx = 0; idx < pageCount; ++idx) {
			const tmp = pages[idx]
			let param = window.location.href.split("?")[1]
			let routeName = params.path
			if (param && !params.path.split("?")[1]) {
				routeName = `${params.path}?${param}`
			}
			const [match, result] = this.rps.parse("/" + routeName, tmp.route)
			if (match) {
				curPage = tmp
				parseParams = result
				break
			}
		}
		

		if (curPage === "") {
			 if (this.clientName === "platform") {
				 this.transitionTo("shell", "overview")
			 } else if (this.clientName === "offweb") {
				this.transitionTo("shell", "home")
			 }
		}

		/**
		 * 2. 动态的把需要的JS加载到dom中
		 */
		if (curPage.uri) await this.jsl.loadRemoteJsSync(curPage.uri)
		if (curPage.cat) await this.jsl.loadRemoteJsSync(curPage.cat)
		const clientName = curPage.clientName
		const modelName = camelize(curPage.name) + "RouteModel"
		const data = await window[clientName][modelName](
			this,
			parseParams,
			curPage
		)

		let tmp = {}
		if (data) {
			tmp = this.deepCopy(data)
		}

		// console.log(tmp)
		return RSVP.hash({
			page: curPage,
			data: tmp,
			// data: data,
			_isVue: true
		})
	}

	deepCopy(obj, cache = []) {
		if (obj instanceof Model) {
			const id = obj.id
			obj = obj.toJSON()
			obj.id = id
		}

		function find(list, f) {
			return list.filter(f)[0]
		}

		// just return if obj is immutable value
		if (obj === null || typeof obj !== "object") {
			return obj
		}

		// if obj is hit, it is in circular structure
		const hit = find(cache, (c) => c.original === obj)
		if (hit) {
			return hit.copy
		}

		const copy = Array.isArray(obj) ? [] : {}
		// put the copy into cache at first
		// because we want to refer it in recursive deepCopy
		cache.push({
			original: obj,
			copy
		})

		Object.keys(obj).forEach((key) => {
			copy[key] = this.deepCopy(obj[key], cache)
		})

		return copy
	}
}
