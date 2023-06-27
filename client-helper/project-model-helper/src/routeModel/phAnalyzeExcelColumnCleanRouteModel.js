// eslint-disable-next-line no-unused-vars
export async function phAnalyzeExcelColumnCleanRouteModel(route, parseParams) {
	// route.browserEventsService.registerListener("dataset-lst")
	return {
		projectName: parseParams.query.projectName,
		tmpname: parseParams.query.tmpname,
		projectId: parseParams.query.projectId,
		_isVue: true,
		popupBack: true
	}
}
