import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class EventModel extends Model {
    @attr('string') title;
    @attr('string') subTitle;
    @attr('string') description;
    @attr('date') startDate;
    @attr('date') endDate;
    @attr('number') language;
    @hasMany("participant") speakers;
}
