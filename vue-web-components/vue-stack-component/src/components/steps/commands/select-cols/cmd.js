/**
 * 这个就是我所说的Command Instance
 */
export default class PhSelectColsCmd {
    constructor(columns, matches) {
		this.dscols = {}
		this.columns = columns.map(x => { return { name: x }})
        this.ds = matches.map(x => x["ds"])
        for (let idx = 0; idx < matches.length; ++idx) {
            this["dscols"][matches[idx]["ds"]] = matches[idx]["columns"].map(x => { return { name: x }})
        }
    }

    exec() {

    }

	refreshData(name) {
		this.ds.push(name)
		this.dscols[name] = new Array(this.columns.length).fill({name: null})
	}

    removeStackDs(item, index) {
        this.ds.splice(index, 1)
        delete this[item]
    }

    addSelectColumn() {
        this.columns.push({ name: "" })
		let arr = new Array({name: null})
        this.ds.forEach(x => {
            this.dscols[x] = this.dscols[x].concat(arr)
        })
    }

    deleteSelectColumn(index) {
        this.columns.splice(index, 1)
        this.ds.forEach(x => {
            this["dscols"][x].splice(index, 1)
        })
    }

	updateSelectColumnValue(dsname, index, name) {
		this["dscols"][dsname][index] = {
			"name": name
		}
	}

	deleteAllSelectColumn() {
		this.columns = []
		this.ds.forEach(x => {
            this["dscols"][x] = []
        })
	}

    validations() {
        return true
    }

    revert2Defs() {
        const result = { "columnsMatches": [] }
        const keys = Object.keys(this)
        for (let idx = 0; idx < keys.length; ++idx) {
            const key = keys[idx]
            if (key === "ds") {
                result["selectedColumns"] = this["columns"].map(x => x.name)
            } else if (key === "columns") {
                result["selectedColumns"] = this["columns"].map(x => x.name)
            } else if (key === "dscols"){
				const dscolskeys = Object.keys(this.dscols)
				dscolskeys.forEach(it => {
					result["columnsMatches"].push({
						"ds": it,
						"columns": this["dscols"][it].map(x => x.name)
					})
				})
            }
        }
        return result
    }
}
