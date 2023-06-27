import Model, { attr } from "@ember-data/model"

export default class ScenarioModel extends Model {
	@attr("string") projectId
	@attr("string") scenarioName
	@attr("number") index
	@attr("boolean") active
	@attr("string") args
	@attr("string") label
	@attr("string") owner
	@attr("string") traceId
}
