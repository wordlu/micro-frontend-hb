/* eslint-disable ember/no-classic-classes */
import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class ReportModel extends Model {
    @attr('string') name;
    @attr('string') title;
    @attr('string') occupation;
    @attr('number') language;
    @belongsTo('image') avatar;
    @belongsTo('event') event;
    @belongsTo('zone') zone;
}