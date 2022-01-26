import React from 'react';
import classNames from 'classnames';
import Money from '../money';
import Text from '../text';

type VirtualWalletCardContentProps = {
    amount: number;
    currency: string;
    has_footer: boolean;
    wallet_name: string;
};

const VirtualWalletCardContent = ({ amount, currency, has_footer, wallet_name }: VirtualWalletCardContentProps) => {
    return (
        <div
            className={classNames('dc-virtual-wallet-card__content', {
                'dc-virtual-wallet-card__content--no-footer': !has_footer,
            })}
        >
            <Text color='colored-background' size='xxxs'>
                {wallet_name}
            </Text>
            <Text color='colored-background' size='s' weight='bold'>
                <Money amount={amount} currency={currency} show_currency />
            </Text>
        </div>
    );
};

export default VirtualWalletCardContent;
