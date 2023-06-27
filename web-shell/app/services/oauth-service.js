import Service from "@ember/service"
import { inject as service } from "@ember/service"
import config from "web-shell/config/environment"
import fetch from "fetch"
import ENV from "web-shell/config/environment"

export default class OauthServiceService extends Service {
	@service cookies;
	@service router
	@service store

	clientSecret = config.APP.clientSecret
	accountsUri = ENV.APP.accountsUri
	scope =  ENV.APP.scope

	get redirectUri() {
		if (ENV.environment === "development") {
			return ENV.APP.DEV.redirectUri
		} else {
			return ENV.APP.redirectUri
		}
	}

	get clientId() {
		if (ENV.environment === "development") {
			return ENV.APP.DEV.redirectClientId
		} else {
			return ENV.APP.redirectClientId
		}
	}

	oauthCallback(transition) {
		const cookies = this.cookies
		let that = this
		transition.queryParams = {
			code: transition.intent.router._lastQueryParams.code,
			state: transition.intent.router._lastQueryParams.state
		}
		const { queryParams } = transition

		if (queryParams.code && queryParams.state) {
			// 获取oauth-callback 中的query
			const redirectUri = this.redirectUri
			const clientId = this.clientId
			const secret = this.clientSecret
			const grantType = "authorization_code"
			const code = queryParams.code
			const url = "https://api.hubadata.com/hboauth/token"
			const body = `code=${code}&grant_type=${grantType}&redirect_uri=${redirectUri}`
			const b64 = window.btoa(`${clientId}:${secret}`)
			const authorization = `Basic ${b64}`
			let options = {
				method: "POST",
				headers: {
					authorization,
					"Content-Type":
						"application/x-www-form-urlencoded; charset=UTF-8",
					accept: "application/json, text/javascript, */*; q=0.01"
				},
				body: body
			}
			fetch(url, options)
				.then((res) => {
					return res.json()
				})
				.then(async (response) => {
					this.removeAuth()
					let options = {
						domain: ".hubadata.com",
						path: "/",
						maxAge: response.expiresIn
					}
					cookies.write( "access_token", response.access_token, options )
					cookies.write( "refresh_token", response.refresh_token, options )
					cookies.write( "token_type", response.token_type, options )
					cookies.write( "expires_in", response.expiresIn, options )
					cookies.write( "user_name", response.user.name, options)
					cookies.write( "user_name_show", encodeURI(response.user.lastName+response.user.firstName), options)
					cookies.write( "user_email", response.user.email, options)
					cookies.write( "company_id", response.user.employerId, options)
					cookies.write( "user_name_show", encodeURI(response.user.lastName+response.user.firstName), options)
					cookies.write( "account_id", response.user.id, options )
					let userData = await that.store.findRecord( "account", that.cookies.read('account_id') )
					//请求employer的数据
					let employerId = await userData.belongsTo('employer').id()
					let employerData = await that.store.findRecord( "partner", employerId )
					cookies.write( "company_name_show", encodeURI(employerData.name), options)
					this.get( "router" ).transitionTo("shell", "overview")
				})
				.catch((_) => {
					this.router.transitionTo("shell", "overview")
				})
		} else {
			this.router.transitionTo("shell", "overview")
		}
	}

	judgeAuth() {
		let tokenFlag = false
		let token = this.cookies.read("access_token")

		if (typeof token !== "undefined" && token !== null && token !== "") {
			tokenFlag = true
		}

		return tokenFlag
	}

	removeAuth() {
		let options = {
			domain: ".hubadata.com",
			path: "/"
		}

		let keys = document.cookie.match(/[^ =;]+(?=\=)/g)
		if (keys) {
			keys.forEach((x) => {
				this.cookies.clear(x, options)
			})
		}

		window.console.log("clear cookies!")
	}

	obtainAuth() {
		let cookies = this.get( "cookies" )
		if (!cookies.read("access_token")) {
			const x = JSON.stringify({"client_id": this.clientId, "redirect_uri": this.redirectUri, "time": new Date().getTime()})
			const state = window.btoa(x)
			window.location.href =
				`${this.accountsUri}/welcome?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&state=${state}&scope=${this.scope}`
		}
	}
}
