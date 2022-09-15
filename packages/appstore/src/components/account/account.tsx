import React from 'react';
import { Text, Button } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import WalletIcon from 'Assets/svgs/wallet';
import { getCurrencyDisplayCode, isMobile, routes } from '@deriv/shared';
import { useHistory } from 'react-router-dom';

type TOptionsAccountprops = {
    account_icon: string;
    account_icon_mobile: string;
    account_title?: string;
    account_number?: string;
    account_balance?: string;
    account_button?: string;
    currency?: string;
};

const OptionsAccount = ({
    account_icon,
    account_icon_mobile,
    account_title,
    account_number,
    account_balance,
    account_button,
    currency,
}: TOptionsAccountprops) => {
    const history = useHistory();
    const onClickDeposit = () => {
        history.push(routes.cashier_deposit);
    };
    return (
        <div className='account__container'>
            <div className='account__container--icon'>{isMobile() ? <WalletIcon icon={account_icon_mobile} /> : <WalletIcon icon={account_icon} />}</div>
            <div className='account__container--account-details-wrapper'>
                <div className='account__container--account-details-wrapper--name-number'>
                    <Text className='account__container--account-details-wrapper--name-number--name' weight='bold'>
                        <Localize i18n_default_text={account_title} />
                    </Text>
                    <Text className='account__container--account-details-wrapper--name-number--number'>{account_number}</Text>
                </div>

                <Text className='account__container--account-details-wrapper--balance'>
                    {account_balance}
                    {` ${getCurrencyDisplayCode(currency)}`}
                </Text>
            </div>
            <div className='account__container--account-reset-button'>
                {/* <Text className='account__container--account-reset-button--label' onClick={onClickDeposit}>
                    <Localize i18n_default_text={account_button} />
                </Text> */}

                <Button className='account__container--account-reset-button--label' has_effect text={localize(account_button)} onClick={onClickDeposit} />
            </div>
            {isMobile() && account_title !== 'Demo' && (
                <div className='account__container--dropdown'>
                    <WalletIcon icon={'DropDown'} />
                </div>
            )}
        </div>
    );
};

export default OptionsAccount;
