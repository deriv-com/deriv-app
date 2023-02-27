import { localize } from '@deriv/translations';

export const generatePlaceholderText = selected_doc => {
    switch (selected_doc) {
        case 'drivers_license':
            return localize('Enter Driver License Reference number');
        case 'ssnit':
            return localize('Enter your SSNIT number');
        default:
            return localize('Enter your document number');
    }
};
