import Model, { attr, hasMany, belongsTo } from "@ember-data/model"

export default class SlideModel extends Model {
	@attr("string") pdId
	@attr("string") slideId
	@attr("string") content
	@attr("string") title
	@attr("number") idx
	@attr("string") datasetName
}
