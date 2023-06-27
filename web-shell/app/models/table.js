import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class TableModel extends Model {
	@attr("string") name;
	@attr("string") database;
	@attr("string") provider;
	@attr("string") version;
    @belongsTo("db") db
	@attr meta
}
