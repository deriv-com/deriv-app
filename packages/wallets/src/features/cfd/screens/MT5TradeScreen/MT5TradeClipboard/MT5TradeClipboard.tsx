import React, { FC } from 'react';
import { WalletClipboard, WalletText } from '../../../../../components/Base';
import EditIcon from '../../../../../public/images/ic-edit.svg';
import './MT5TradeClipboard.scss';

type TMT5TradeClipboardProps = {
    label: string;
    value: string;
    variant?: 'clipboard' | 'password';
};
const MT5TradeClipboard: FC<TMT5TradeClipboardProps> = ({ label, value, variant = 'clipboard' }) => {
    return (
        <div className='wallets-mt5-trade-clipboard'>
            <WalletText color='less-prominent' size='sm'>
                {label}
            </WalletText>
            <div className='wallets-mt5-trade-clipboard__values'>
                <WalletText size='sm' weight='bold'>
                    {value}
                </WalletText>
                {variant === 'clipboard' ? (
                    <WalletClipboard popoverAlignment='right' successMessage='lol' textCopy={value} />
                ) : (
                    <EditIcon className='wallets-mt5-trade-clipboard__edit' />
                )}
            </div>
        </div>
    );
};

export default MT5TradeClipboard;
