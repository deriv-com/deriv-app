import React, { FC } from 'react';
import { WalletClipboard, WalletText } from '../../../../../components/Base';
import EditIcon from '../../../../../public/images/ic-edit.svg';
import './MT5TradeDetailsItem.scss';

type TMT5TradeDetailsItemProps = {
    label: string;
    value: string;
    variant?: 'clipboard' | 'password';
};
const MT5TradeDetailsItem: FC<TMT5TradeDetailsItemProps> = ({ label, value, variant = 'clipboard' }) => {
    return (
        <div className='wallets-mt5-trade-details-item'>
            <WalletText color='less-prominent' size='sm'>
                {label}
            </WalletText>
            <div className='wallets-mt5-trade-details-item__values'>
                <WalletText size='sm' weight='bold'>
                    {value}
                </WalletText>
                {variant === 'clipboard' ? (
                    <WalletClipboard popoverAlignment='right' successMessage='lol' textCopy={value} />
                ) : (
                    // TODO: Show ChangePasswordModal onClick this icon
                    <EditIcon className='wallets-mt5-trade-details-item__edit' onClick={() => undefined} />
                )}
            </div>
        </div>
    );
};

export default MT5TradeDetailsItem;
