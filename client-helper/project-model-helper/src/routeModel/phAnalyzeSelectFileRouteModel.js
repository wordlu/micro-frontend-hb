export async function phAnalyzeSelectFileRouteModel(route, parseParams) {
	// route.browserEventsService.registerListener("dataset-lst")
	let datasets = await route.store.peekAll("dataset")
	console.log(parseParams)
	return {
		projectName: parseParams.query.projectName,
		projectId: parseParams.query.projectId,
		uploadType: parseParams.query.uploadType,
		datasetArr: datasets.filter(
			(it) => it.cat != "catalog" && it.cat.indexOf("index") == -1
		),
		_isVue: true
	}
}
