import Model, { attr } from "@ember-data/model"

export default class LayoutModel extends Model {
	@attr("string") clientId
	@attr("string") clientName
	@attr("string") version
	@attr("string") name
	@attr("string") css
	@attr("string") script
}
