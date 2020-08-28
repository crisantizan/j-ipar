import Vue from 'vue';
import { enUsFormatter } from '../helpers/number-format';

Vue.filter('enUsFormatter', value => enUsFormatter.format(value));

Vue.filter('slice', (value, start, end) => value.toString().slice(start, end));

Vue.filter('multiply', (value, arg) => Number(value) * Number(arg));
