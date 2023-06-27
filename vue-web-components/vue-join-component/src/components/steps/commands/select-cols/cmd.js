/**
 * 这个就是我所说的Command Instance
 */
export default class PhSelectedColsCmd {
    constructor(defs) {
        console.log(defs)
        this.retrievedCols = defs["columns"]
        this.ds = defs["ds"]
		this.index = defs["index"]
        this.prefix = defs["prefix"]
        this.type = defs["type"]
    }

    exec() {

    }

    validations() {
        return true
    }

    revert2Defs() {
        return {
            ds: this.ds,
			index: this.index,
            prefix: this.prefix,
            type: this.type,
            columns: this.retrievedCols
        }
    }
}
