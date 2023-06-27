import PhSelectColsCmd from "./cmd"

/**
 * 这个就是我所说的Command
 */
export default class PhSelectColsStep {
    constructor(dbstep) {
        this.content= dbstep
        this.expressions = JSON.parse(dbstep["expressions"])
        const columns = this.expressions["params"]["selectedColumns"]
        const matches = this.expressions["params"]["columnsMatches"]
        this.command = new PhSelectColsCmd(columns, matches)
    }

	refreshData(name, i) {
		this.command.refreshData(name, i)
	}

    exec() {
        if (this.command.validations())
            this.command.exec()
    }

    validate() {
        return true
    }

    revert2Defs() {
        return this.command.revert2Defs()
    }
}
