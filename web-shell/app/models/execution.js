import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class ExecutionModel extends Model {
	@attr('string') input;
	@attr('number') endTime;
	@attr('string') owner;
	@attr('string') smId;
	@attr('number') startTime;
	@attr('string') state;
	@attr('string') steps;
}
