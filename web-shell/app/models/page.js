import Model from "@ember-data/model"
import { attr } from "@ember-data/model"

export default class PageModel extends Model {
	@attr("string") "client-id"
	@attr("string") clientName
	@attr("string") version
	@attr("string") name
	@attr("string") route
	@attr("string") uri
	@attr("string") cat // list, command
	@attr("number") level
	@attr("string") engine // ember, vue, react
}
