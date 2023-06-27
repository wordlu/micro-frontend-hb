import PhFilterOnValueCmd from "./cmd"

/**
 * 这个就是我所说的Command
 */
export default class PhFilterStep {
    constructor(dbstep) {
        this.content= dbstep
        this.expressions = JSON.parse(dbstep["expressions"])
        this.command = new PhFilterOnValueCmd(this.expressions)
        dbstep.callback = this
        // this.groupName = dbstep["group-name"]
        // this.groupId = dbstep["group-id"]
        // this.isGrouped = len(this.groupName) > 0
    }

    exec() {
        if (this.command.validations())
            this.command.exec()
    }
}
