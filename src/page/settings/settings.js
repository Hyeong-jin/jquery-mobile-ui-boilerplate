import _ from 'lodash';
import 'fastclick';
import style from './settings.scss';
import template from './settings.hbs';

export default class settings {
  constructor() {
    this.template = template;
    this.style = style;
  }

  render() {
    return $.when($(document.body).prepend($(template())));
  }
}
