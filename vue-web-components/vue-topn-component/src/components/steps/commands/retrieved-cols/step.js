import PhRetrievedColsCmd from "./cmd"

/**
 * 这个就是我所说的Command
 */
export default class PhRetrievedColsStep {
    constructor(dbstep) {
        this.content= dbstep
        this.expressions = JSON.parse(dbstep["expressions"])
        const defs = this.expressions["params"]["retrievedColumns"]
        this.command = new PhRetrievedColsCmd(defs)
    }

    exec() {
        if (this.command.validations())
            this.command.exec()
    }

    revert2Defs() {
        return this.command.revert2Defs()
    }
}
