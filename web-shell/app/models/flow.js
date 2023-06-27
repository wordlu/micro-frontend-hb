import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class FlowModel extends Model {
	@belongsTo("project") project;
	@hasMany("stateMachine") stateMachines;
}
