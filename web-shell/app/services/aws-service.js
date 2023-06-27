import Service from "@ember/service"
// import { computed } from "@ember/object"

const credentials = {
	accessKeyId: "AKIAWPBDTVEAPOX3QT6U",
	secretAccessKey: "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"
}

export default class AwsServiceService extends Service {
	get s3Client() {
		AWS.config.update(credentials)
		AWS.config.update({ region: "cn-northwest-1" })
		return new AWS.S3({ apiVersion: "2006-03-01" })
	}
	get s3Avatar() {
		AWS.config.update(credentials)
		AWS.config.update({ region: "cn-northwest-1" })
		return new AWS.S3({
			apiVersion: "2006-03-01",
			params: { Bucket: "general.hubadata.com" }
		})
	}
}
