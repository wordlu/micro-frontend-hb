import PhComputedCmd from "./cmd"

/**
 * 这个就是我所说的Command
 */
export default class PhComputedStep {
    constructor(dbstep) {
        this.content= dbstep
        this.expressions = JSON.parse(dbstep["expressions"])
        const defs = this.expressions["params"]["computedColumns"]
        this.command = new PhComputedCmd(defs)
    }

    exec() {
        if (this.command.validations())
            this.command.exec()
    }

    validate() {
        return true
    }

    revert2Defs() {
        return this.command.revert2Defs()
    }

	iframeComplete(event) {
		if(event.data.editorStaus === "complete") {
			// this.datasource.refreshData(this.datasource.parent)
		}
	}

	async getEditorContentEvent(event) {
		if (event.data.editorId === "topnEditor") {
			// const codeEditorContent = event.data.content
			// this.queryEditorContent(codeEditorContent)
			this.downloadCode++
		}

	}
}
