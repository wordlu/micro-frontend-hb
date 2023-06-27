// import { hostName } from "../config/envConfig"

export async function phNotebookEditorContainerRouteModel(route, parseParams) {
	const tenantId = route.cookies.read("company_id")
	return {
		tenantId: tenantId,
		detailName: parseParams.query.detailName,
		type: parseParams.query.type,
		projectName: parseParams.query.projectName,
		projectId: parseParams.query.projectId,
		resourceId: parseParams.query.resourceId,
		_isVue: true
	}
}
