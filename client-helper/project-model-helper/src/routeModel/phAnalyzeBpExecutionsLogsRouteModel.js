export async function phAnalyzeBpExecutionsLogsRouteModel(route, parseParams) {
	// route.browserEventsService.registerListener("dataset-lst")
	return {
		projectName: parseParams.query.projectName,
		projectId: parseParams.query.projectId,
		jobShowName: parseParams.query.jobShowName,
		jobIndex: parseParams.query.jobIndex,
		_isVue: true
	}
}
