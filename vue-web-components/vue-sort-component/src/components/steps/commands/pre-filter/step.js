import PhPreFilterCmd from "./cmd"

/**
 * 这个就是我所说的Command
 */
export default class PhFilterStep {
    constructor(dbstep, schema) {
        this.content= dbstep
        this.expressions = JSON.parse(dbstep["expressions"])
        const defs = this.expressions["params"]["preFilter"]
        this.distinct = defs["distinct"]
        this.enabled = defs["enabled"]
        this.preFilterExpression = defs["expression"]
        this.command = new PhPreFilterCmd(this.preFilterExpression, schema)
    }

    exec() {
        if (this.command.validations())
            this.command.exec()
    }

    revert2Defs() {
        const result = this.enabled ? this.command.revert2Defs() : ""
        return {
            "distinct": false,
            "enabled": this.enabled,
            "expression": result
        }
    }

}
