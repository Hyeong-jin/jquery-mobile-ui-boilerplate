import _ from 'lodash';
import rest from '../../lib/ajax';
import style from './page1.scss';
import template from './page1.hbs';

export default class Page1Page {
  constructor() {
    this.template = template;
    this.style = style;
    this.data = {};
    this.title = 'Page Title';
  }

  render() {
    var $d = $.Deferred();

    this.retrieveApi().then(response => {
      this.data = response;
      this.display().then(() => {
        $d.resolve();
      });
    });

    return $d;
  }

  retrieveApi() {
    return rest('https://jsonplaceholder.typicode.com/posts/1');
  }

  display() {
    return $.when($(document.body).prepend($(template(this))));
  }
}
