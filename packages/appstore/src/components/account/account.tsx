import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import WalletIcon from 'Assets/svgs/wallet';
import { getCurrencyDisplayCode } from '@deriv/shared';

type TOptionsAccountprops = {
    account_icon: string;
    account_title?: string;
    account_number?: string;
    account_balance?: string;
    account_button?: string;
    currency?: string;
};

const OptionsAccount = ({
    account_icon,
    account_title,
    account_number,
    account_balance,
    account_button,
    currency,
}: TOptionsAccountprops) => {
    return (
        <div className='account__container'>
            <div className='account__container--icon'>
                <WalletIcon icon={account_icon} />
            </div>
            <div className='account__container--account-details-wrapper'>
                <div className='account__container--account-details-wrapper--name-number'>
                    <Text className='account__container--account-details-wrapper--name-number--name' weight='bold'>
                        <Localize i18n_default_text={account_title} />
                    </Text>
                    <Text className='account__container--account-details-wrapper--name-number--number'>
                        {account_number}
                    </Text>
                </div>

                <Text className='account__container--account-details-wrapper--balance'>
                    {account_balance}
                    {` ${getCurrencyDisplayCode(currency)}`}
                </Text>
            </div>
            <div className='account__container--account-reset-button'>
                <Text className='account__container--account-reset-button--label'>
                    <Localize i18n_default_text={account_button} />
                </Text>
            </div>
            <div className='account__container--dropdown'>
                <WalletIcon icon={'DropDown'} />
            </div>
        </div>
    );
};

export default OptionsAccount;
