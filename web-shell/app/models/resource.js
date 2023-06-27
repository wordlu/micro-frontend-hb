import Model, { attr } from "@ember-data/model"

export default class ResourceModel extends Model {
	@attr("string") tenantId
    @attr("string") ctype
    @attr("string") owner
    @attr("string") ownership
    @attr("string") platform
    @attr("string") properties
    @attr("string") resultPath
    @attr("string") role
    @attr("string") label
    @attr("string") name
    @attr("number") priority
}
