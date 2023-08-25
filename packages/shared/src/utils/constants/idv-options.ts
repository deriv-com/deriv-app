import { localize } from '@deriv/translations';

export const getIDVNotApplicableOption = (is_for_new_real_account?: boolean) => ({
    id: 'none',
    text: is_for_new_real_account ? localize('I want to do this later') : localize("I don't have any of these"),
    value: 'none',
});
