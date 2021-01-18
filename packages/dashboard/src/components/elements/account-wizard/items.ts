import {
    currencySelectorConfig,
    personalDetailsConfig,
    addressDetailsConfig,
    termsOfUseConfig,
    financialDetailsConfig,
    PersonalDetails,
    TermsOfUse,
} from '@deriv/account';
import { walletSelectorConfig } from './containers/wallet-selector-form';
import { TWizardItemConfig } from './types';
import CurrencySelector from './containers/currency-selector-form';
import AddressDetails from './containers/address-details-form';
import FinancialDetails from './containers/financial-details-form';

type TRealAccountSignupTarget = {
    real_account_signup_target: string;
};

const shouldShowFinancialDetails = ({ real_account_signup_target }: TRealAccountSignupTarget): boolean =>
    real_account_signup_target === 'maltainvest';

const shouldShowPersonalAndAddressDetailsAndCurrency = ({
    real_account_signup_target,
}: TRealAccountSignupTarget): boolean => real_account_signup_target !== 'samoa';

export const getItems = (props: any): TWizardItemConfig[] => {
    return [
        walletSelectorConfig(props),
        ...(shouldShowPersonalAndAddressDetailsAndCurrency(props)
            ? [currencySelectorConfig(CurrencySelector, props)]
            : []),
        ...(shouldShowPersonalAndAddressDetailsAndCurrency(props)
            ? [personalDetailsConfig(PersonalDetails, props)]
            : []),
        ...(shouldShowPersonalAndAddressDetailsAndCurrency(props) ? [addressDetailsConfig(AddressDetails, props)] : []),
        ...(shouldShowFinancialDetails(props) ? [financialDetailsConfig(FinancialDetails, props)] : []),
        termsOfUseConfig(TermsOfUse, props),
    ];
};
