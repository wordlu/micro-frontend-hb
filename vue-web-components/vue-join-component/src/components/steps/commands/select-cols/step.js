import PhSelectedColsCmd from "./cmd"

/**
 * 这个就是我所说的Command
 */
export default class PhSelectedColsStep {
    constructor(dbstep) {
        this.content= dbstep
        this.expressions = JSON.parse(dbstep["expressions"])
        const defs = this.expressions["params"]["selectedColumns"]
        this.commands = defs.map(x => new PhSelectedColsCmd(x))
    }

    exec() {

    }

    revert2Defs() {
        return this.commands.map (x => x.revert2Defs())
    }
}
