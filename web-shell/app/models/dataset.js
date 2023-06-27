import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class DatasetModel extends Model {
	@attr("string") projectId
	@attr("string") schema
	@attr("string") version
	@attr("string") name
	@attr("string") label
	@attr("string") cat
	@attr("string") path
	@attr("string") format
	@attr("string") prop
	@attr("string") sample
}
