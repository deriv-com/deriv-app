import { localize } from '@deriv/translations';

export default {
    currency: {
        supported_in: ['maltainvest', 'malta', 'svg', 'iom'],
        default_value: '',
        rules: [['req', localize('Select an item')]],
    },
};
