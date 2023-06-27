// eslint-disable-next-line no-unused-vars
import { hostName, actionTableName } from "../config/envConfig"

export async function phNotebookEditorContainerEventHandler(e, route) {
	console.log(route)
	// let params = e.detail[0].args.param

	switch (e.detail[0].args.callback) {
		case "linkToPage":
			break
		default:
			console.log("other click event!")
	}
}
