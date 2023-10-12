import { localize } from '@deriv/translations';
/**
 * Returns an object that allows user to skip IDV
 */

export const getIDVNotApplicableOption = () => ({
    id: 'none',
    text: localize('I want to do this later'),
    value: 'none',
});

/**
 * Returns default value for the text to render when there are no matching results.
 */
export const getSearchNotFoundOption = () => localize('No results found');
