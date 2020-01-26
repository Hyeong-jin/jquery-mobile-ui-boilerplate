import _ from 'lodash';
import rest from '../../lib/ajax';
import style from './page2.scss';
import template from './page2.hbs';

export default class Page2Page {
  constructor() {
    this.template = template;
    this.style = style;
    this.data = {};
    this.title = 'TODO';
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
    return rest('https://jsonplaceholder.typicode.com/todos/1');
  }

  display() {
    return $.when($(document.body).prepend($(template(this))));
  }
}
