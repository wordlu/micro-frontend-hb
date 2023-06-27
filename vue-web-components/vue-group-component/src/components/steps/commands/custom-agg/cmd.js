/**
 * 这个就是我所说的Command Instance
 */
export default class PhCustomAggCmd {
    constructor(defs) {
        console.log(defs)
        this.customName = defs["customName"]
        this.customExpr = defs["customExpr"]
        this.type = defs["type"]
    }

    exec() {

    }

    validations() {
        return true
    }

    revert2Defs() {
        // return this.retrievedCols
        // TODO: @wodelu
    }
}
