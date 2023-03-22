import { localize } from '@deriv/translations';
import { Jurisdiction } from '@deriv/shared';

export default {
    currency: {
        supported_in: [Jurisdiction.MALTA_INVEST, 'malta', Jurisdiction.SVG, 'iom'],
        default_value: '',
        rules: [['req', localize('Select an item')]],
    },
};
