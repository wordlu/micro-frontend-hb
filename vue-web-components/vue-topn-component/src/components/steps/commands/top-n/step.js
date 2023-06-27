import PhTopNCmd from "./cmd"

/**
 * 这个就是我所说的Command
 */
export default class PhTopNStep {
    constructor(dbstep) {
        this.content= dbstep
        this.expressions = JSON.parse(dbstep["expressions"])
        const defs = this.expressions["params"]
        this.command = new PhTopNCmd(defs)
    }

    exec() {
        if (this.command.validations())
            this.command.exec()
    }

    revert2Defs() {
        return this.command.revert2Defs()
    }
}
