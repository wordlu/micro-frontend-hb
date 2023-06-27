import Service from "@ember/service"

export default class RemoteLoadingService extends Service {
	loadedJs = []

	loadRemoteJs(source, callback) {
		let that = this
		const script = document.createElement("script")

		script.onload = function () {
			that.loadedJs.push(source)
			if (callback) {
				callback()
			}
		}
		if (this.loadedJs.indexOf(source) === -1) {
			script.src = source
			document.head.appendChild(script)
		}
	}

	loadRemoteJsSync(source) {
		let that = this
		return new Promise((resolve, reject) => {
			const script = document.createElement("script")
			script.onload = () => {
				that.loadedJs.push(source)
				resolve()
			}
			script.onerror = () => {
				reject("cannot load script " + source)
			}
			if (this.loadedJs.indexOf(source) === -1) {
				script.src = source
				document.head.appendChild(script)
			} else {
				resolve()
			}
		})
	}
}
