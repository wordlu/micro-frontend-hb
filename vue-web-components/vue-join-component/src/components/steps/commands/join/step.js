import PhJoinCmd from "./cmd"

/**
 * 这个就是我所说的Command
 */
export default class PhJoinStep {
    constructor(dbstep) {
        this.content= dbstep
        this.expressions = JSON.parse(dbstep["expressions"])
        const defs = this.expressions["params"]["joins"]
        this.commands = defs.map(x => { return new PhJoinCmd(x) })
		this.dsIdxArr = []
        this.datasets = this.queryDatasets()
    }

    queryDatasets() {
        const res = []
		this.dsIdxArr = []
        for (let idx = 0; idx < this.commands.length; ++idx) {
            for (let idn = 0; idn < this.commands[idx]["datasets"].length; ++idn) {
                const tmp = this.commands[idx]["datasets"][idn]["name"]
                const tmpI = this.commands[idx]["datasets"][idn]["index"]
                if (!this.dsIdxArr.includes(tmpI)) {
					this.dsIdxArr.push(tmpI)
					res.push(tmp)
				}
            }
        }
        return res
    }

    hitHeight() {
        let res = 0
        for (let idx = 0; idx < this.commands.length; ++idx) {
            // for (let idn = 0; idn < this.commands[idx]["on"].length; ++idn) {
            //     res += 30
            // }
            res += 350
        }
        return Math.max(320, res)
    }

    hitWidth() {
        return (500 + 3) * this.datasets.length - 60
    }

    computeTop(idx) {
        let res = 0
        for (let iter = 0; iter < this.commands.length; ++iter) {
            if (iter === idx) break

            // for (let idn = 0; idn < this.commands[idx]["on"].length; ++idn) {
            //     res += 30
            // }

			res += 330
        }
        return res
    }

    computeHeight(idx) {
        let res = 0
        for (let iter = 0; iter < this.commands.length; ++iter) {
            if (iter !== idx) continue

            for (let idn = 0; idn < this.commands[idx]["on"].length; ++idn) {
                res += 30
            }
        }
        return Math.max(300, res)
    }

    exec() {
        // if (this.command.validations())
        //     this.command.exec()
    }

    revert2Defs() {
        // return this.command.revert2Defs()
        return this.commands.map(x => x.revert2Defs())
    }
}
