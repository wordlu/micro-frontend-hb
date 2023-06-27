import { dasherize } from "@ember/string"
import { pluralize } from "ember-inflector"
import { inject as service } from "@ember/service"
import ENV from "web-shell/config/environment"
import JSONAPIAdapter from "@ember-data/adapter/json-api"
import { ComputeJSONAPIIamHeader } from "../lib/PhIamClicent"

export default class ApplicationAdapter extends JSONAPIAdapter {
	@service cookies

	// host = ENV.APP.apiUri
	get host() {
		if (ENV.environment === "development") {
			return ENV.APP.apiUriDev
		} else {
			return ENV.APP.apiUri
		}
	}
	authType = "oauth"

	pathForType(type) {
		let typeArray = ENV.APP.typeArray
		if (typeArray.indexOf(type) !== -1) {
			this.authType = "iam"
			return "hbtemplate/" + pluralize(dasherize(type))
		} else {
			this.authType = "oauth"
			return "hbplatform/" + pluralize(dasherize(type))
		}
	}

	sortQueryParams(params) {
		let result = {}
		const keys = Object.keys(params).sort()
		for (let index = 0; index < keys.length; ++index) {
			const key = keys[index]
			let cur = params[key]
			if (cur instanceof Array) {
				cur = cur.sort()
			}
			result[key] = cur
		}
		return result
	}

	// eslint-disable-next-line no-unused-vars
	buildURL(modelName, id, snapshot, requestType, query) {
		const url = super.buildURL(...arguments)
		if (this.authType === "iam") {
			this.iamHeaders = ComputeJSONAPIIamHeader(
				ENV.APP.apiHost,
				url,
				{},
				query,
				ENV.APP.AWS_ACCESS_KEY,
				 ENV.APP.AWS_SECRET_KEY
			)
		}
		return url
	}

	attributesToDeal(data) {
		// data is object
		const keys = Object.keys(data).sort()
		const obj = {}

		keys.forEach((k) => {
			const key = dasherize(k)

			obj[key] = data[k]
		})
		return obj
	}

	// eslint-disable-next-line no-unused-vars
	handleResponse(status, headers, payload, _) {
		//处理project list(resource)数据
		if (
			payload &&
			payload.data &&
			payload.data.length > 0 &&
			payload.meta &&
			payload.meta.count > 0
		) {
			// eslint-disable-next-line no-unused-vars
			payload.data.forEach((item, _) => {
				item.attributes.meta = item.meta
				item.attributes.includes = payload.included
			})
		}
		//处理executions数据
		if (
			payload &&
			payload.data &&
			payload.data.length > 0 &&
			payload.data[0].meta
		) {
			// eslint-disable-next-line no-unused-vars
			payload.data.forEach((item, _) => {
				item.attributes.meta = item.meta
			})
		}
		//处理dag数据
		else if (payload && payload.data && payload.data.meta) {
			payload.data.attributes.meta = payload.data.meta
		}
		return payload
	}

	get headers() {
		if (this.authType === "oauth") {
			if (ENV.environment === "development") {
				return {
					Accept: "application/vnd.api+json",
					"Content-Type": "application/vnd.api+json",
					// Authorization: ENV.APP.debugToken
					Authorization: this.cookies.read("access_token")
				}
			} else {
				return {
					Accept: "application/vnd.api+json",
					"Content-Type": "application/vnd.api+json",
					Authorization: this.cookies.read("access_token")
				}
			}
		} else if (this.authType === "iam") {
			return this.iamHeaders
		}
	}
}
