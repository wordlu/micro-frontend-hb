
export default class PhCodeEditorModel {
    constructor(dict) {
        this.role = dict["role"]
        this.ctype = dict["ctype"]
        this.owner = dict["owner"]
        this.ownership = dict["ownership"]
        this.platform = dict["platform"]
		this.status = 0
		this.switch = false
		this.codeeditorsResourceId = dict.id

        this.metadata = JSON.parse(dict["properties"])[0]
        this.applicationType = this.metadata["type"]
        this.applicationVersion = this.metadata["version"]
        this.applicationLabels = this.parseLabels(this.metadata["label"])

		this.defaultStatus()
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

	getCookie(name) {
        let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
        arr = document.cookie.match(reg)
        if (arr) return (arr[2])
        else return null
    }

	defaultStatus() {
		let id = this.getCookie("jupyterTraceId")
		if (id && id !== "") {
			this.status = 2
			this.switch = true
		} else {
			this.status = 0
			this.switch = false
		}
	}
}
