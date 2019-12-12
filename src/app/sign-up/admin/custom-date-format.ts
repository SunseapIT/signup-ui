
import * as _moment from 'moment';

const moment = (_moment as any).default ? (_moment as any).default : _moment;

export const MY_CUSTOM_FORMATS = {
fullPickerInput: 'DD-MM-YYYY HH:mm',
parseInput: 'YYYY-MM-DD HH:mm:ss',
datePickerInput: 'YYYY-MM-DD HH:mm:ss',
timePickerInput: 'LT',
monthYearLabel: 'MMM YYYY',
dateA11yLabel: 'LL',
monthYearA11yLabel: 'MMMM YYYY'
};