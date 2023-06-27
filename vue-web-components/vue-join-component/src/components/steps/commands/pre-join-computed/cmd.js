/**
 * 这个就是我所说的Command Instance
 */
export default class PhComputedCmd {
    constructor(defs) {
        this.computedCols = defs
        this.pattern = "SQL Expression"
    }

    exec() {

    }

	editComputedCol(idx, it) {
        this.computedCols.splice(idx, 1, it)
        return it
    }

    insertComputedCol() {
        const res = {
            "expr": "",
            "name": "",
            "type": "int"
        }
        this.computedCols.push(res)
        return res
    }

    count() {
        return this.computedCols.length
    }

    removeComputedCol(idx) {
        this.computedCols.splice(idx, 1)
    }

    validations() {
        return true
    }

    revert2Defs() {
        return this.computedCols
    }
}
