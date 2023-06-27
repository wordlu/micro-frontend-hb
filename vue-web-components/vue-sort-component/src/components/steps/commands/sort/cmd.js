/**
 * 这个就是我所说的Command Instance
 */
export default class PhSortCmd {
    constructor(defs) {
        console.log(defs)
        this.orders = defs
    }

    exec() {

    }

    insertSortCloase(col) {
        this.orders.push({
            "column": col,
            "desc": false
        })
    }

    deleteSortCloase(idx) {
        this.orders.splice(idx, 1)
    }

    validations() {
        return true
    }

    revert2Defs() {
        return this.orders
    }
}
