import PhCustomAggCmd from "./cmd"

/**
 * 这个就是我所说的Command
 */
export default class PhCustomAggStep {
    constructor(dbstep) {
        this.content= dbstep
        this.expressions = JSON.parse(dbstep["expressions"])
        const defs = this.expressions["params"]["values"].filter(x => Object.keys(x).includes("customExpr"))
        this.commands = defs.map(x => new PhCustomAggCmd(x))
    }

    exec() {
        // if (this.command.validations())
        //     this.command.exec()
    }

    revert2Defs() {
        // return this.command.revert2Defs()
        // TODO: @wodelu
    }
}
