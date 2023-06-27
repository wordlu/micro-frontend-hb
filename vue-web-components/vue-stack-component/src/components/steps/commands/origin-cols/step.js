import PhStackOriginCmd from "./cmd"

/**
 * 这个就是我所说的Command
 */
export default class PhStackOriginStep {
    constructor(dbstep) {
        this.content= dbstep
        this.expressions = JSON.parse(dbstep["expressions"])
        const defs = this.expressions["params"]["originColumn"]
        this.command = new PhStackOriginCmd(defs)
    }

    exec() {
        if (this.command.validations())
            this.command.exec()
    }

    revert2Defs() {
        return this.command.revert2Defs()
    }
}
