import Model, { attr } from "@ember-data/model"

export default class DashboardModel extends Model {
	@attr("string") projectId
	@attr("string") dashboardId
	@attr("string") description
	@attr("string") title
	@attr("string") updating
	@attr("string") label
}
