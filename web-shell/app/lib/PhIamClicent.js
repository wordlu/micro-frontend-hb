/**
 *  alfredyang@hubadata.com 2021.12.31
 */

import PhSigV4AWSClientFactory from "./PhSigV4AWSClientFactory"

function ComputeJSONAPIIamHeader(
	apiHost,
	path,
	body,
	query,
	ak,
	sk,
	ct = "application/vnd.api+json",
	at = "application/vnd.api+json",
	method = "GET"
) {
	const factory = PhSigV4AWSClientFactory
	const endpoint = /(^https?:\/\/[^\/]+)/g.exec(path)[1]
	const pathComponent = path.substring(endpoint.length)
	let queryURL = pathComponent
	const queryParamIndex = queryURL.lastIndexOf("?")
	if (queryParamIndex > -1) {
		queryURL = queryURL.substring(0, queryParamIndex)
	}
	const sigV4ClientConfig = {
		accessKey: ak,
		secretKey: sk,
		sessionToken: "",
		serviceName: "execute-api",
		region: "cn-northwest-1",
		endpoint: apiHost,
		defaultContentType: ct,
		defaultAcceptType: at
	}
	const client = factory.PhSigV4AWSClientFactory.newClient(sigV4ClientConfig)

	let queryParams = {}
	if (query) {
		const queryKeys = Object.keys(query)
		for (let idx = 0; idx < queryKeys.length; ++idx) {
			const k = encodeURI(queryKeys[idx])
			// const v = encodeURI(query[queryKeys[idx]])
			const v = query[queryKeys[idx]]
			queryParams[k] = v
		}
	}

	let req = {
		verb: method.toUpperCase(),
		path: queryURL,
		queryParams: queryParams,
		body: {}
	}
	const request = client.makeRequest(req)
	return request.headers
}

export { ComputeJSONAPIIamHeader }
