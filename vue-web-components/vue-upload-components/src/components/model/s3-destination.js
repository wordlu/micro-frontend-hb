
import * as AWS from "aws-sdk"

export default class PhS3Destination {
    constructor(id) {
        // constructor(id, bucket="", prefix="") {
        this.id = id
        this.client = new AWS.S3(
            {
                apiVersion: '2006-03-01',
                accessKeyId: "AKIAUD4RXJNYTX7IF6GW",
                secretAccessKey: "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",
                region: "cn-northwest-1"
            }
        )
    }

    async upload(data, to, timestamp) {
        // PBDP-3261: 将分隔符换成31
        // const lines = data.map(x => x.join(String.fromCharCode(31)))
        const lines = data.map(x => x.join(","))
        const body = lines.join("\n")
        const params = {
            Body: body,
            Bucket: "hb-platform",
            Key: `2020-11-11/lake/${to}/huba_lake_` + timestamp.toString()
        }

        const that = this
        return await new Promise((resolve, reject) => {
            that.client.putObject(params, function(err, data) {
                if (err) {
                    console.log(err)
                    reject(err)
                } else {
                    console.log(data)
                    resolve(data)
                }
            })
        })
    }
}
