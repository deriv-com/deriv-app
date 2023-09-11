import { localize } from '@deriv/translations';

// TODO: Update with other platform and CFDs
export const getWalletCFDTitle = (type: string) => {
    switch (type) {
        case 'synthetic':
            return localize('MT5 Derived');
        case 'all':
            return localize('MT5 SwapFree');
        case 'financial':
            return localize('MT5 Financial');
        default:
            return '';
    }
};
