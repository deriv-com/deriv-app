import React from 'react';
import { Text, Button } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import WalletIcon from 'Assets/svgs/wallet';
import { getCurrencyDisplayCode, isMobile, routes } from '@deriv/shared';
import { useHistory } from 'react-router-dom';

type TOptionsAccountprops = {
    currency_icon: string | undefined;
    // account_title?: string;
    loginid?: string;
    balance?: string;
    account_button?: string;
    currency?: string;
    display_type: string;
    has_balance?: boolean;
    has_reset_balance?: boolean;
    is_disabled?: boolean;
    is_virtual?: boolean;
};

const OptionsAccount = ({
    currency_icon,
    //account_title,
    loginid,
    balance,
    currency,
    display_type,
    has_balance,
    has_reset_balance,
}: TOptionsAccountprops) => {
    const history = useHistory();
    const onClickDeposit = () => {
        history.push(routes.cashier_deposit);
    };
    return (
        <div className='account__container'>
            <div className='account__container--icon'>
                {isMobile() ? <WalletIcon icon={currency_icon} /> : <WalletIcon icon={currency_icon} />}
            </div>
            <div className='account__container--account-details-wrapper'>
                <div className='account__container--account-details-wrapper--name-number'>
                    <Text className='account__container--account-details-wrapper--name-number--name' weight='bold'>
                        <Localize i18n_default_text={getCurrencyDisplayCode(currency)} />
                    </Text>
                    <Text className='account__container--account-details-wrapper--name-number--number'>{loginid}</Text>
                </div>

                <Text className='account__container--account-details-wrapper--balance'>
                    {balance}
                    {getCurrencyDisplayCode(currency)}
                </Text>
            </div>
            <div className='account__container--account-reset-button'>
                {/* <Text className='account__container--account-reset-button--label' onClick={onClickDeposit}>
                    <Localize i18n_default_text={account_button} />
                </Text> */}

                <Button
                    className='account__container--account-reset-button--label'
                    has_effect
                    text={localize('Deposit')}
                    onClick={onClickDeposit}
                />
            </div>
            {isMobile() && getCurrencyDisplayCode(currency) !== 'Demo' && (
                <div className='account__container--dropdown'>
                    <WalletIcon icon={'DropDown'} />
                </div>
            )}
        </div>
    );
};

export default OptionsAccount;
