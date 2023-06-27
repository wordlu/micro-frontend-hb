/**
 * pqian@hubadata.com 2022.2.10
 */

function PhMQTT(config, callBack, destroyQueue) {
	let intervalId = null
	let timeoutId = null
	let use_cache = []
	let time = new Date().getTime()
	const topic = config.topic
	const endpoint = config.endpoint
	const timeout = config.timeout
	const uri = endpoint // https://api.hubadata.com/hbnotification/ TODO:整体测试结束后提出到env.js中


	const __getCookie = (name) => {
		const cookies = document.cookie.split("; ");
		const cookiesMap = cookies.map((item) => {
			const cookie = {}
			const [k, v] = item.split("=")
			cookie[k] = v
			return cookie
		}).reduce((pre, next) => Object.assign(pre, next))
		return cookiesMap[name]
	}

	const __subscribe = () => {
		if (!callBack) {
			throw Error("CallBack Is Undefined")
		}

		const parameter = Object.assign({}, config.parameter)
		delete parameter.callBack

		const states = {
			failed: true,
			fail: true,
			succeed: true,
			success: true,
			canceled: true,
			started: true,
			stopped: true,
			stopfailed: true,
			startfailed: true
		}
		
		const url = `${uri}${parameter.projectId}/${parameter.ownerId}/${parameter.eventName}`


		const __to_array = (payload, content) => {
			const contents = payload.filter((item) => item.jobCat === "notification")
			if (contents.length > 0) {
				time = new Date().getTime()
				const flag = contents.map((item) => { 
					return states[item.status] || false
				}).reduce((pre, next) => pre && next)
				if (flag) {
					destroyQueue.push(topic)
				}
				callBack(parameter, content)
			}
		}
	
		const __to_normal = (payload, content) => {
			if (Object.keys(payload).length > 0) {
				const { status, jobCat} = payload
				if (jobCat === "notification") {
					time = new Date().getTime()
					const state = states[status] || false
					if (state) {
						destroyQueue.push(topic)
					}
					callBack(parameter, content)
				}
			}
		}
		
		const choose_func = {
			true: __to_array,
			false: __to_normal
		}
		
		intervalId = setInterval(async () => {
			const headers = {
				Authorization: __getCookie("access_token"),
				Accept: "application/json",
				"Content-Type": "application/json",
			}
			const options = {
				method: "POST",
				headers,
				body: JSON.stringify({
					target: parameter.remoteResource,
					id: parameter.id,
					runnerId: parameter.runnerId,
					type: "ptp"
				})
			}
			const result = await fetch(url, options)
			const payload = await result.json()

			const content = JSON.stringify(payload)
			const b64 = window.btoa(unescape(encodeURIComponent(content)))
			// console.info("Find Local Cache Item ====> ",
			// 	use_cache.find((item) => item === b64))
			
			if (!use_cache.find((item) => item === b64)) {
				use_cache.push(b64)
				choose_func[payload instanceof Array](payload, content)
			}

			// if (Object.keys(payload).length > 0) {
			// 	const {
			// 		status,
			// 		jobCat,
			// 		jobDesc,
			// 		message
			// 	} = payload
				
			// 	if (!use_cache.find((item) => item === b64)) {
			// 		// 只接受jobCat为Notification标识
			// 		// TODO：@Alex 这部分需要重整一下
			// 		if (jobCat === "notification") {
			// 			use_cache.push(b64)
			// 			time = new Date().getTime()

			// 			// UnRegister 将错误的和完成的关掉
			// 			if (jobDesc.indexOf("runDag") !== -1) {
			// 				const {
			// 					cnotification: { overallStatus }
			// 				} = JSON.parse(message)
			// 				// console.warn(overallStatus)
			// 				const runDagState = states[overallStatus] || false
			// 				if (runDagState) {
			// 					destroyQueue.push(topic)
								
			// 				}
			// 			} else {
			// 				const state = states[status] || false
			// 				if (state) {
			// 					destroyQueue.push(topic)
			// 				}
			// 			}
			// 			callBack(parameter, content)
			// 		}
			// 	}
			// }
		}, 3000 * 1) // 5秒 后续可编程参数，先实现
	}

	const __timeout = () => {
		timeoutId = setInterval(() => {
			const currentTime = new Date().getTime() / 1000
			if (currentTime - time / 1000 > timeout) {
				const parameter = Object.assign({}, config.parameter)
				delete parameter.callBack
				callBack(parameter, JSON.stringify({ status: "mqtt timeout" }))
				destroyQueue.push(topic)
			}
		}, 1000 * 2)
	}

	const connect = async () => {
		__subscribe()
		__timeout()
	}

	const disconnect = () => {
		if (intervalId) {
			clearInterval(intervalId)
			clearInterval(timeoutId)
			
		}

		use_cache = []
	}

	return {
		connect: connect,
		disconnect: disconnect
	}
}

export { PhMQTT }
