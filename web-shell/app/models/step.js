import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class StepModel extends Model {
	@attr('string') stId;
	@attr('string') input;
	@attr('string') logLocation;
	@attr('string') output;
	@attr('string') state;
	@attr('string') stepLog;
	@attr('number') startTime;
	@attr('endTime') startTime;
}
