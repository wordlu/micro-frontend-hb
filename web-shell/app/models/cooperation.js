import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class CooperationModel extends Model {
    @attr('string') name;
    @attr('string') companyType;
    @attr('string') logo;
    @attr('number') language;
    @belongsTo('image') logo;
}
