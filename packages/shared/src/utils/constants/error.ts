import { localize } from '@deriv/translations';

export const getDefaultError = () => ({
    header: localize('Something went wrong'),
    description: localize('Please try again later.'),
    cta_label: localize('Back to homepage'),
});
