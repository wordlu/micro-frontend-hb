/**
 * 这个就是我所说的Command Instance
 */

export default class PhJoinCmd {
    constructor(defs) {
        this.datasets = defs["datasets"].sort(x => x.index)
		this.schema = []
        this.caseInsensitive = defs["caseInsensitive"]
        this.normalizeText = defs["normalizeText"]
        this.type = defs["type"]
        this.on = defs["on"]
    }

    exec() {

    }

    validations() {
        return true
    }

    insertJoinCloase(left, right, ls, rs) {
        this.on.push({
            "type": "=",
            "conditions": [
                {
                    "ds": left,
                    "column": ls.src
                },
                {
                    "ds": right,
                    "column": rs.src
                }
            ]
        })
    }

    deleteJoinCloase(idx) {
        this.on.splice(idx, 1)
    }

    revert2Defs() {
        return {
            datasets: this.datasets,
            normalizeText: this.normalizeText,
			type: this.type,
            caseInsensitive: this.caseInsensitive,
            on: this.on.map(x => { return {
                type: x["type"],
                conditions: x["conditions"]
            }})
        }
    }
}
