import { localize } from '@deriv/translations';
import { generateValidationFunction, getDefaultFields } from '@deriv/shared';
import { TWizardItemConfig } from 'Components/elements/account-wizard/types';
import WalletSelector from './wallet-selector';
import './wallet-selector.scss';

export const wallet_selector_config = {
    wallet: {
        default_value: '',
        rules: [['req', localize('Select an item')]],
        supported_in: ['svg', 'iom', 'malta', 'maltainvest'],
    },
};

export const walletSelectorConfig = ({
    real_account_signup_target,
}: {
    real_account_signup_target?: string;
}): TWizardItemConfig => {
    return {
        header: {
            active_title: localize('Select your wallet'),
            title: localize('WALLET'),
        },
        body: WalletSelector,
        form_value: getDefaultFields(real_account_signup_target, wallet_selector_config),
        props: {
            validate: generateValidationFunction(real_account_signup_target, wallet_selector_config),
        },
        passthrough: ['legal_allowed_currencies'],
        icon: 'IcDashboardWallet',
    };
};
