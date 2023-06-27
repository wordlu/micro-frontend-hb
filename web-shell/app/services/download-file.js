import Service from "@ember/service"
import { inject as service } from "@ember/service"
import fetch from "fetch"

export default class DownloadFileService extends Service {
	@service cookies

	downloadFile(param) {
		let source = param
		let bucket = ""
		let key = ""
		const url = "https://api.hubadata.com/entry/download"
		if (source.indexOf("s3a://") != -1) {
			let str = source.slice(6, source.length)
			let num = str.indexOf("/")
			bucket = str.substring(0, num)
			key = str.substring(num + 1, str.length)
		} else {
			bucket = "ph-origin-files"
			key = source
		}
		const body = {
			bucket: bucket,
			key: key
		}
		let options = {
			method: "POST",
			headers: {
				authorization: this.cookies.read("access_token"),
				"Content-Type": "application/json",
				accept: "application/json"
			},
			body: JSON.stringify(body)
		}
		fetch(url, options)
			.then((res) => {
				return res.json()
			})
			.then((response) => {
				let url = response.url
				window.open(url)
				// let link = document.createElement( "a" )
				// link.download = "filename"
				// link.href = url
				// document.body.appendChild( link )
				// link.click()
				// document.body.removeChild( link )
			})
	}
}
