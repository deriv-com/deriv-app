import React, { FC } from 'react';
import classNames from 'classnames';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { WalletClipboard } from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import { ChangePassword } from '../../ChangePassword';
import './MT5TradeDetailsItem.scss';

type TMT5TradeDetailsItemProps = {
    label?: string;
    value?: string;
    variant?: 'clipboard' | 'info' | 'password';
};

const MT5TradeDetailsItem: FC<TMT5TradeDetailsItemProps> = ({ label, value = '', variant = 'clipboard' }) => {
    const { isDesktop } = useDevice();
    const { show } = useModal();

    const textSize = isDesktop ? 'xs' : 'sm';
    return (
        <div
            className={classNames('wallets-mt5-trade-details-item', {
                'wallets-mt5-trade-details-item--info': variant === 'info',
            })}
        >
            {variant === 'clipboard' && (
                <React.Fragment>
                    <Text color='less-prominent' size={textSize}>
                        {label}
                    </Text>
                    <div className='wallets-mt5-trade-details-item__values'>
                        <Text
                            className='wallets-mt5-trade-details-item__values--mono-text'
                            size={textSize}
                            weight='bold'
                        >
                            {value}
                        </Text>
                        <WalletClipboard popoverAlignment='left' textCopy={value} />
                    </div>
                </React.Fragment>
            )}
            {variant === 'password' && (
                <React.Fragment>
                    <Text color='less-prominent' size={textSize}>
                        {label}
                    </Text>
                    <div className='wallets-mt5-trade-details-item__values'>
                        <Text
                            as='a'
                            className='wallets-mt5-trade-details-item__values--forgot-link'
                            onClick={() => show(<ChangePassword />)}
                            size={textSize}
                            weight='bold'
                        >
                            <Localize i18n_default_text=' Forgot Password?' />
                        </Text>
                    </div>
                </React.Fragment>
            )}
            {variant === 'info' && (
                <Text color='less-prominent' size={textSize}>
                    {value}
                </Text>
            )}
        </div>
    );
};

export default MT5TradeDetailsItem;
