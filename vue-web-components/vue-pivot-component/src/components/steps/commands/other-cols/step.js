import PhGroupCmd from "./cmd"

/**
 * 这个就是我所说的Command
 */
export default class PhGroupStep {
    constructor(dbstep) {
        this.content= dbstep
        this.expressions = JSON.parse(dbstep["expressions"])
        this.defs = this.expressions["params"]["otherColumns"]
    }

	refreshDatasource(schemas) {
		this.schema = schemas
		this.refreshCols(schemas)
		this.resetCommands(schemas)
	}

	resetCommands(schema) {
		const results = schema.map(x => {
            const tmp = new PhGroupCmd()
			let par = []
			if (!this.commands || this.commands.length === 0) {
				par = this.defs.filter(it => it["column"] === x.src)
			} else {
				par = this.commands.filter(it => it["column"] === x.src) 
			}
            if (par.length > 0) tmp.initWithDefs(par[0])
            else tmp.initWithSchema(x.src, x.type)
            return tmp
        })
		this.commands = results
	}

    refreshCols(keys) {
        this.keys = keys.map(it => it.src)
    }

    addCol2Key(col) {
        this.keys.push(col)
    }

    exec() {}

    revert2Defs() {
		const commandsArray = this.commands.map(it => {
			it.isUsed = false
			return it
		})
        return commandsArray.filter(x => this.keys.includes(x.column) && Object.values(x).includes(true)).map(x => x.revert2Defs())
    }
}
