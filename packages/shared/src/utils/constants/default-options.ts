import { localize } from '@deriv/translations';
import { isProduction } from '../config/config';
/**
 * Returns an object that allows user to skip IDV
 */

export const getIDVNotApplicableOption = (is_for_real_account_signup_modal?: boolean) => ({
    id: 'none',
    text: is_for_real_account_signup_modal
        ? localize('I want to do this later')
        : localize("I don't have any of these"),
    value: 'none',
});

/**
 * Returns default value for the text to render when there are no matching results.
 */
export const getSearchNotFoundOption = () => localize('No results found');

/**
 * Returns List of unsupported languages based on the environment.
 */
export const UNSUPPORTED_LANGUAGES = isProduction() ? ['ID'] : [];
