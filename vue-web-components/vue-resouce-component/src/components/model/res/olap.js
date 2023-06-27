
export default class PhOlapModel {
    constructor(dict) {
        this.role = dict["role"]
        this.ctype = dict["ctype"]
        this.owner = dict["owner"]
        this.ownership = dict["ownership"]
        this.platform = dict["platform"]

        this.metadata = JSON.parse(dict["properties"])[0]
        this.applicationType = this.metadata["type"]
        this.applicationVersion = this.metadata["version"]
        this.applicationLabels = this.parseLabels(this.metadata["label"])
    }

    parseLabels(dict) {
        const result = []
        for (let idx = 0; idx < Object.keys(dict).length; ++idx) {
            const k = Object.keys(dict)[idx]
            const v = dict[k]
            result.push([k, v].join(" : "))
        }
        return result
    }
}
