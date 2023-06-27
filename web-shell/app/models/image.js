import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class ImageModel extends Model {
    @attr('string') path;
    @attr('string') tag;
    @belongsTo('image') report;
}
