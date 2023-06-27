import Service from "@ember/service"
import R from "ramda"

export default class RouteParseService extends Service {
	parse(uri, template) {
		const qIdx = uri.indexOf("?")
		let resourceUri = uri
		let queryUri = ""
		if (qIdx > -1) {
			resourceUri = uri.substring(0, qIdx)
			queryUri = uri.substring(qIdx + 1)
		}
		const factory = new StageFactory()

		const templateArr = template.split("/")
		const resourceArr = resourceUri.split("/")

		try {
			const isMatch = templateArr.length === resourceArr.length
			if (!isMatch) {
				throw new Error("not match")
			}
			const paramArr = factory.zip(templateArr, resourceArr)
			let stages = []
			for (let idx = 0; idx < paramArr.length; ++idx) {
				stages.push(
					factory.createStageInstance(
						"param",
						paramArr[idx][0],
						paramArr[idx][1]
					)
				)
			}

			let queryArr = queryUri.split("&")
			queryArr = queryArr.map(_ => _.split("="))
			for (let idx = 0; idx < queryArr.length; ++idx) {
				stages.push(
					factory.createStageInstance(
						"query",
						queryArr[idx][0],
						queryArr[idx][1]
					)
				)
			}

			const byCat = R.groupBy(_ => _.cat)
			let reVal = byCat(stages.map(_ => _.parse()))
			const keys = Object.keys(reVal)
			const result = {}
			for (let idx = 0; idx < keys.length; ++idx) {
				result[keys[idx]] = factory.array2Object(reVal[keys[idx]])
			}
			return [true, result]
		} catch (e) {
			return [false, null]
		}
	}

	queryLogicControllerName(uri) {
		let result = uri
		if (uri && uri.length > 0) {
			const cIdx = uri.indexOf("/")
			if (cIdx === -1) {
				result = uri
			} else {
				result = uri.substring(0, cIdx)
			}
		}
		return result
	}
}

class Stage {
	template = ""
	resource = ""

	constructor(_t, _r) {
		this.template = _t
		this.resource = _r
	}

	parse() {
		throw new Error("not implemented")
	}
}

class ParamStage extends Stage {
	constructor(_t, _r) {
		super(_t, _r)
	}

	parse() {
		let tmp = {
			cat: "param"
		}
		if (this.template.startsWith("{") && this.template.endsWith("}")) {
			this.template = this.template.substring(
				this.template.indexOf("{") + 1,
				this.template.lastIndexOf("}")
			)
			tmp[this.template] = this.resource
		} else {
			if (this.template !== this.resource) {
				throw new Error("not match")
			}
		}
		return tmp
	}
}

class QueryStage extends Stage {
	constructor(_t, _r) {
		super(_t, _r)
	}

	parse() {
		let tmp = {
			cat: "query"
		}
		tmp[this.template] = this.resource
		return tmp
	}
}

class StageFactory {
	createStageInstance(category, template, resource) {
		if (category === "param") {
			return new ParamStage(template, resource)
		} else if (category === "query") {
			return new QueryStage(template, resource)
		} else {
			throw new Error("not implemented")
		}
	}

	zip = (...arr) =>
		Array.from({ length: Math.max(...arr.map((a) => a.length)) }, (_, i) =>
			arr.map((a) => a[i])
		)

	array2Object(arr) {
		const result = {}
		const length = arr.length
		for (let idx = 0; idx < length; ++idx) {
			const tmp = arr[idx]
			const keys = Object.keys(tmp)
			for (let ik = 0; ik < keys.length; ++ik) {
				result[keys[ik]] = tmp[keys[ik]]
			}
		}
		return result
	}
}
