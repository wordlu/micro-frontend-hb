import PhDistinctCmd from "./cmd"

/**
 * 这个就是我所说的Command
 */
export default class PhDistinctStep {
    constructor(dbstep) {
        this.content= dbstep
        this.expressions = JSON.parse(dbstep["expressions"])
        const defs = this.expressions["params"]["keys"]
        this.globalCount = this.expressions["params"]["globalCount"]
        this.command = new PhDistinctCmd(defs)
    }

    exec() {
        if (this.command.validations())
            this.command.exec()
    }

    revert2Defs() {
        return {
            keys: this.command.revert2Defs(),
            globalCount: this.globalCount
        }
    }
}
