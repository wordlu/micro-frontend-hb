/**
 * 这个就是我所说的Command Instance
 */
export default class PhTopNCmd {
    constructor(defs) {
        this.firstRows = defs["firstRows"]
        this.lastRows = defs["lastRows"]
        this.keys = defs["keys"]
        this.orders = defs["orders"]
        this.denseRank = defs["denseRank"]
        this.rank = defs["rank"]
        this.duplicateCount = defs["duplicateCount"]
        this.rowNumber = defs["rowNumber"]
        this.isAllCols = this.keys.length === 0
    }

    exec() {

    }

    validations() {
        return true
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

    insertKeyCloase(col) {
        this.keys.push(col)
    }

    deleteKeyCloase(idx) {
        this.keys.splice(idx, 1)
    }

    revert2Defs() {
        return this
    }
}
