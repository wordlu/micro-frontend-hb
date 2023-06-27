/**
 * 这个就是我所说的Command Instance
 */
export default class PhStackOriginCmd {
    constructor(defs) {
        this.enabled = defs["enabled"]
        this.columnName = defs["columnName"]
        this.originDatasets = defs["originDatasets"].map(x => { return {
            ds: x["ds"],
            value: x["value"]
        }})
    }

    exec() {

    }

    validations() {
        return true
    }

    revert2Defs() {
        return {
            enabled: this.enabled,
            columnName: this.columnName,
            originDatasets: this.originDatasets.map(x => { return {
                ds: x["ds"],
                value: x["value"]
            }})
        }
    }
}
