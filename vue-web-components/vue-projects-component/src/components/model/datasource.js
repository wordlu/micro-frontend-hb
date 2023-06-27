import { hostName } from '../../config/envConfig'

export default class PhProjectDatasource {
    constructor(id, parent) {
		this.parent = parent
        this.id = id
        this.debugToken = '6445aa0d7c3cc866c8501dc0df4b9ca1a181de0d0fa0015a99bdaf5588d79bc2'
        this.traceId = ""
        this.statusCode = 0
        this.status = "started"
        this.resetSwitch()
    }

    resetSwitch() {
        this.switch = this.statusCode === 1 || this.statusCode === 2
    }

    getCookie(name) {
        let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        arr = document.cookie.match(reg)
        if (arr) return (arr[2])
        else return this.debugToken
    }

	setCookie (c_name, value, expiredays) {
		let exdate = new Date();
		exdate.setDate(exdate.getDate() + expiredays);
		document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
	}


	delCookie(name) {
		let exp = new Date();
		exp.setTime(exp.getTime() - 1);
		let cval = this.getCookie(name);
		if (cval != null)
			document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
	}

    buildQuery(tenantId) {
        const url = `${hostName}/hbtenantstatus`
        const accessToken = this.getCookie("access_token")
		console.log(tenantId)
        let body = {
            "tenantId": tenantId
            // "tenantId": "alfredtest"
        }
        let options = {
            method: "POST",
            headers: {
                "Authorization": accessToken,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                "accept": "application/json"
            },
            body: JSON.stringify(body)
        }
        return fetch(url, options)
    }

    refreshStatus(tenantId, callback=null) {
        const that = this
        // const traceId = this.getCookie("tenantTraceId")
        this.buildQuery(tenantId)
            .then((response) => response.json())
            .then((response) => {
                that.traceId = response.traceId
                that.statusCode = response.status
                that.status = response.message
				// if (response.traceId !== "" && response.traceId !== traceId) {
				// 	const cookiesOptions = {
				// 		domain: ".hubadata.com",
				// 		path: "/"
				// 	}
				// 	that.delCookie("tenantTraceId")
				// 	that.setCookie("tenantTraceId", response.traceId, cookiesOptions)
				// }
                that.resetSwitch()
                if (callback)
                    callback()
            })
    }

	buildStartQuery(tenantId) {
		console.log(tenantId)
        const url = `${hostName}/hbtenantboottrigger`
        const accessToken = this.getCookie("access_token")
		const traceId = this.guid()
        let body = {
            "tenantId": tenantId,
            // "tenantId": "alfredtest",
			"traceId": traceId,
			"owner": this.getCookie("account_id"),
			"showName":  decodeURI(
				decodeURI(
					this.getCookie("user_name_show")
				)
			)
        }
        let options = {
            method: "POST",
            headers: {
                "Authorization": accessToken,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                "accept": "application/json"
            },
            body: JSON.stringify(body)
        }
        return fetch(url, options)
    }

    resourceStart(tenantId) {
        const that = this
        this.buildStartQuery(tenantId)
            .then((response) => response.json())
            .then((response) => {
				that.parent.dealResourceStart(response)
            })
    }

	buildStopQuery(tenantId) {
		console.log(tenantId)
        const url = `${hostName}/hbtenantstoptrigger`
        const accessToken = this.getCookie("access_token")
		const traceId = this.getCookie("tenantTraceId")
        let body = {
            "tenantId": tenantId,
            // "tenantId": "alfredtest",
			"traceId": traceId,
			"owner": this.getCookie("account_id"),
			"showName":  decodeURI(
				decodeURI(
					this.getCookie("user_name_show")
				)
			)
        }
        let options = {
            method: "POST",
            headers: {
                "Authorization": accessToken,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                "accept": "application/json"
            },
            body: JSON.stringify(body)
        }
        return fetch(url, options)
    }

    resourceStop(tenantId) {
        const that = this
        this.buildStopQuery(tenantId)
            .then((response) => response.json())
            .then((response) => {
				that.parent.dealResourceStop(response)
            })
    }

	guid() {
		return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(
			/[xy]/g,
			function (c) {
				var r = (Math.random() * 16) | 0,
					v = c == "x" ? r : (r & 0x3) | 0x8
				return v.toString(16)
			}
		)
	}
}
