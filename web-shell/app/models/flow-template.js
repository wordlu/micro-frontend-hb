import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class FlowTemplateModel extends Model {
	@attr('string') name;
	@attr("objs") params;
}
