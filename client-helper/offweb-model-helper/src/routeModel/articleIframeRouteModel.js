// eslint-disable-next-line no-unused-vars
export async function articleIframeRouteModel(route, parseParams, curPage) {
	let uri = `${parseParams.query.uri}`
	return {
		url: uri
	}
}
