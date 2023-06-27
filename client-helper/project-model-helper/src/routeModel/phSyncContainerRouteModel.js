// import { hostName } from "../config/envConfig"

// eslint-disable-next-line no-unused-vars
export async function phSyncContainerRouteModel(route, parseParams) {
	const syncData = await route.store.peekRecord("tempdata", "sync")

	const scriptsParams = syncData.jsondata
	const inputsData = scriptsParams.inputs[0].name
		? scriptsParams.inputs[0].name
		: scriptsParams.inputs[0]

	const inputs = [inputsData]

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
		outputs: outputs,
		inputs: inputs,
		jobName: jobName,
		jobId: jobId,
		_isVue: true,
		popupBack: true
	})
	return {
		projectName: parseParams.query.projectName,
		projectId: parseParams.query.projectId,
		outputs: outputs,
		inputs: inputs,
		jobName: jobName,
		jobId: jobId,
		_isVue: true,
		popupBack: true
	}
}
