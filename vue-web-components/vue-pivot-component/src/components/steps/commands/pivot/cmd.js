/**
 * 这个就是我所说的Command Instance
 */
export default class PhPivotCmd {
    constructor(defs, identifiers, schema) {
        this.identifiers = identifiers //行定义
        this.keyColumns = defs["keyColumns"] //列定义
        this.valueColumns = defs["valueColumns"] //聚合

        this.globalCount = defs["globalCount"]
        this.pivotedColumnType = defs["pivotedColumnType"]
        this.topnLimit = defs["topnLimit"]
        this.minOccLimit = defs["minOccLimit"]
        this.explicitValues = defs["explicitValues"]

        this.schema = schema
        this.resetCandiSelection()
    }

    resetCandiSelection(schemasArray) {
		const schema = schemasArray ? schemasArray : this.schema
        this.selection = []
        const vcs = this.valueColumns.map(x => x.column) //聚合-列名
        // const vcods = this.valueColumns.map(x => x.orderColumn) //聚合方法-orderby
        for (let idx = 0; idx < schema.length; ++idx) {
            const tmp = schema[idx].src
            if (!this.identifiers.includes(tmp)
                && !this.keyColumns.includes(tmp)
                && !vcs.includes(tmp)) {
                this.selection.push(tmp)
            }
        }
    }

    insertKeyColumn(item) {
        this.keyColumns.push(item)
    }

    removeKeyColumn(idx) {
        this.keyColumns.splice(idx, 1)
    }

    insertIdfColumn(item) {
        this.identifiers.push(item)
    }

    removeIdfColumn(idx) {
        this.identifiers.splice(idx, 1)
    }

    insertValueColumn(item) {
        this.valueColumns.push({
            "avg": true,
            "column": item,
            "concat": false,
            "concatDistinct": false,
            "concatSeparator": ",",
            "count": false,
            "countDistinct": false,
            "first": false,
            "firstLastNotNull": false,
            "last": false,
            "max": false,
            "min": false,
            "orderColumn": "",
            "stddev": false,
            "sum": false
        })
    }

    removeValueColumn(idx) {
        this.valueColumns.splice(idx, 1)
    }

    exec() {

    }

    validations() {
        return true
    }

    revert2Defs() {
        return {
            identifiers: this.identifiers,
            pivot: {
                globalCount: this.globalCount,
                keyColumns: this.keyColumns,
                pivotedColumnType: this.pivotedColumnType,
                topnLimit: this.topnLimit,
                minOccLimit: this.minOccLimit,
                explicitValues: this.explicitValues,
                valueColumns: this.valueColumns
            }
        }
    }
}
