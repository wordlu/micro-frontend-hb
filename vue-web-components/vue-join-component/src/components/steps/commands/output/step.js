import PhOutputsCmd   from "./cmd"

/**
 * 这个就是我所说的Command
 */
export default class PhOutputsStep {
    constructor(dbstep) {
        this.content= dbstep
        this.expressions = JSON.parse(dbstep["expressions"])
        this.command = new PhOutputsCmd (this.expressions)
    }

    exec() {
        if (this.command.validations())
            this.command.exec()
    }
}
