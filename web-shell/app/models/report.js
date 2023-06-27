import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class ReportModel extends Model {
    @attr('string') title;
    @attr('string') subTitle;
    @attr('string') description;
    @attr('date') startDate;
    @attr('date') date;
    @attr('number') language;
    @belongsTo('image') cover;
    @belongsTo('activity') actAttachments;
    @hasMany("participant") writers;
}
