export async function phAnalyzeBpExecutionsHistoryRouteModel(
	route,
	parseParams
) {
	// route.browserEventsService.registerListener("dataset-lst")
	return {
		projectName: parseParams.query.projectName,
		projectId: parseParams.query.projectId,
		_isVue: true
	}
}
