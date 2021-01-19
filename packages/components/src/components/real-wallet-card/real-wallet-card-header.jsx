import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../icon';
import Money from '../money';
import Text from '../text';

const RealWalletCardHeader = ({
    amount,
    currency,
    is_selected,
    is_temporarily_unavailable,
    wallet_name,
    wallet_type,
}) => {
    return (
        <div
            className={classNames('dc-real-wallet-card__header', {
                'dc-real-wallet-card__header--selected': is_selected,
            })}
        >
            {is_temporarily_unavailable && (
                <div className='dc-real-wallet-card__content'>
                    <Text color='colored-background' size='xxxs'>
                        {wallet_name}
                    </Text>
                    <Text color='colored-background' size='s' weight='bold'>
                        <Money amount={amount} currency={currency} show_currency />
                    </Text>
                </div>
            )}
            {is_selected && <Icon icon='IcCheckmarkBlue' size={32} />}
            <Icon icon={`IcWallet${wallet_type}`} className='dc-real-wallet-card__header--icon' />
        </div>
    );
};

RealWalletCardHeader.propTypes = {
    amount: PropTypes.number,
    currency: PropTypes.string,
    is_selected: PropTypes.bool,
    is_temporarily_unavailable: PropTypes.bool,
    wallet_name: PropTypes.string,
    wallet_type: PropTypes.string,
};

export default RealWalletCardHeader;
