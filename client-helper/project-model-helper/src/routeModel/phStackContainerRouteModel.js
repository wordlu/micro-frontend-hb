// import { hostName } from "../config/envConfig"

// eslint-disable-next-line no-unused-vars
export async function phStackContainerRouteModel(route, parseParams) {
	const stackData = await route.store.peekRecord("tempdata", "stack")

	const scriptsParams = stackData.jsondata

	const inputs = scriptsParams.inputs[0].name
		? scriptsParams.inputs
				.map((it) => it.name)
				.join(",")
				.split(",")
		: scriptsParams.inputs

	const outputsData = scriptsParams.outputs[0].name
		? scriptsParams.outputs[0].name
		: scriptsParams.outputs

	const outputs = [outputsData]

	const jobName = scriptsParams.jobShowName
		? scriptsParams.jobShowName
		: scriptsParams.jobName

	const jobId = scriptsParams.jobId

	console.log({
		projectName: parseParams.query.projectName,
		projectId: parseParams.query.projectId,
		inputs: inputs,
		outputs: outputs,
		jobName: jobName,
		jobId: jobId,
		_isVue: true,
		popupBack: true
	})

	return {
		projectName: parseParams.query.projectName,
		projectId: parseParams.query.projectId,
		inputs: inputs,
		outputs: outputs,
		jobName: jobName,
		jobId: jobId,
		_isVue: true,
		popupBack: true
	}
}
