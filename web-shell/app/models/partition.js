import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class PartitionModel extends Model {
	@attr('string') smID;
	@attr('string') source;
	@attr schema;
	@attr('number') date;
	@attr('string') partitions;
	@attr('string') attribute
}
