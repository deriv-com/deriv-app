import React, { FC } from 'react';
import { WalletClipboard, WalletText } from '../../../../../components/Base';
import EditIcon from '../../../../../public/images/ic-edit.svg';
import './MT5TradeDetailsItem.scss';
import classNames from 'classnames';
import useDevice from '../../../../../hooks/useDevice';

type TMT5TradeDetailsItemProps = {
    label?: string;
    value: string;
    variant?: 'clipboard' | 'info' | 'password';
};

const MT5TradeDetailsItem: FC<TMT5TradeDetailsItemProps> = ({ label, value, variant = 'clipboard' }) => {
    const { isDesktop } = useDevice();
    return (
        <div
            className={classNames('wallets-mt5-trade-details-item', {
                'wallets-mt5-trade-details-item--info': variant === 'info',
            })}
        >
            {variant !== 'info' && (
                <React.Fragment>
                    <WalletText color='less-prominent' size='sm'>
                        {label}
                    </WalletText>
                    <div className='wallets-mt5-trade-details-item__values'>
                        <WalletText size='sm' weight='bold'>
                            {value}
                        </WalletText>
                        {variant === 'clipboard' && (
                            <WalletClipboard popoverAlignment='right' successMessage='lol' textCopy={value} />
                        )}
                        {variant === 'password' && (
                            // TODO: Show ChangePasswordModal onClick this icon
                            <EditIcon className='wallets-mt5-trade-details-item__edit' onClick={() => undefined} />
                        )}
                    </div>
                </React.Fragment>
            )}
            {variant === 'info' && (
                <WalletText color='less-prominent' size={isDesktop ? 'sm' : 'md'}>
                    {value}
                </WalletText>
            )}
        </div>
    );
};

export default MT5TradeDetailsItem;
