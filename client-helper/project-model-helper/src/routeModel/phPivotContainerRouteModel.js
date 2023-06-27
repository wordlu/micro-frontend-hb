// import { hostName } from "../config/envConfig"

// eslint-disable-next-line no-unused-vars
export async function phPivotContainerRouteModel(route, parseParams) {
	const pivotData = await route.store.peekRecord("tempdata", "pivot")

	const scriptsParams = pivotData.jsondata

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
