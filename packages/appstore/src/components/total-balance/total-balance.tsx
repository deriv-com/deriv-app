import * as React from 'react';
import classNames from 'classnames';
import { Icon, Money, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import TotalBalanceDropdown from './total-balance-dropdown';

const TotalBalance: React.FC<TTotalBalanceProps> = ({ amount, currency }) => {
    const [is_dropdown_visible, setIsDropdownVisible] = React.useState(false);

    const toggleDropdown = () => {
        setIsDropdownVisible(!is_dropdown_visible);
    };

    return (
        <React.Fragment>
            <div className='total-balance'>
                <Text color='prominent' size='s' weight='bold'>
                    <Localize i18n_default_text='Total balance' />
                </Text>
                <div className='total-balance__row'>
                    <Text size='l' weight='bold'>
                        <Money
                            amount={amount}
                            className='total-balance__row-amount'
                            currency={currency}
                            show_currency
                        />
                    </Text>
                    <Icon
                        icon='IcChevronDownBold'
                        className={classNames('total-balance__arrow', {
                            'total-balance__arrow--show': is_dropdown_visible,
                            'total-balance__arrow--hide': !is_dropdown_visible,
                        })}
                        onClick={toggleDropdown}
                    />
                </div>
            </div>
            <TotalBalanceDropdown is_visible={is_dropdown_visible} />
        </React.Fragment>
    );
};

interface TTotalBalanceProps {
    amount: number;
    currency: string;
}

export default TotalBalance;
