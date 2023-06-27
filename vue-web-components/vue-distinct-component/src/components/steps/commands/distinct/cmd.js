/**
 * 这个就是我所说的Command Instance
 */
export default class PhDistinctCmd {
    constructor(defs) {
        console.log(defs)
        this.retrievedCols = defs
    }

    exec() {

    }

    validations() {
        return true
    }

    revert2Defs() {
        return this.retrievedCols
    }
}
