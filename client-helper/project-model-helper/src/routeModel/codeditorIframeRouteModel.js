// eslint-disable-next-line no-unused-vars
export async function codeditorIframeRouteModel(route, parseParams, curPage) {
	let uri = `${curPage.uri}?projectId=${parseParams.query.projectId}&jobName=${parseParams.query.jobName}&jobPath=${parseParams.query.jobPath}&runtime=${parseParams.query.runtime}&environment=${route.environment}`
	return {
		projectName: parseParams.query.projectName,
		projectId: parseParams.query.projectId,
		url: uri
	}
}
