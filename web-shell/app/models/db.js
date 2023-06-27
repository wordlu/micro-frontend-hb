import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class DbsModel extends Model {
	@attr("string") name;
    @attr("string") provider;
    @hasMany("table") tables;
	@attr owner
}
