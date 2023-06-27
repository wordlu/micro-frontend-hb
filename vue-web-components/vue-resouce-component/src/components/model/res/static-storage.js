
export default class PhStorageModel {
    constructor(dict) {
        this.role = dict["role"]
        this.ctype = dict["ctype"]
        this.owner = dict["owner"]
        this.ownership = dict["ownership"]
        this.platform = dict["platform"]

        // this.applicationType = property["type"]
        // this.applicationVersion = property["version"]
        // this.applicationLabels = property["label"]

        this.metadata = JSON.parse(dict["properties"])
        console.log(this.metadata)

        this.usage = 20
    }

    queryUsage() {
        // TODO: 读取块的使用情况基于vol id
        return this.usage
    }

    computeTotal() {
        let result = 0
        for (let idx = 0; idx < this.metadata.length; ++idx) {
            const tmp = this.metadata[idx]
            result += tmp.parameters.capacity
        }
        return result
    }

    computeUsage() {

    }

}
