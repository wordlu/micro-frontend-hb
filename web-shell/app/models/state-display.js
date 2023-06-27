import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class StateDisplayModel extends Model {
	@belongsTo("stateMachine") stateMachine;
	@attr("string") name;
	@attr("string") definition;
	@hasMany("script") startScripts;
}
