export async function phDagContainerRouteModel(route, parseParams) {
	return {
		projectName: parseParams.query.projectName,
		projectId: parseParams.query.projectId,
		_isVue: true
	}
}
