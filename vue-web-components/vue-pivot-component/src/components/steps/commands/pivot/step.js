import PhPivotCmd from "./cmd"

/**
 * 这个就是我所说的Command
 */
export default class PhPivotStep {
    constructor(dbstep, schema) {
        this.content= dbstep
        this.expressions = JSON.parse(dbstep["expressions"])
        const defs = this.expressions["params"]["pivot"]
        const identifiers = this.expressions["params"]["identifiers"]
        this.command = new PhPivotCmd(defs, identifiers,  schema)
    }

    exec() {
        // if (this.command.validations())
        //     this.command.exec()
    }

    revert2Defs() {
        return this.command.revert2Defs()
        // return this.commands.map(x => x.revert2Defs())
    }
}
