import React, { FC } from 'react';
import classNames from 'classnames';
import { useTranslations } from '@deriv-com/translations';
import { Text, Tooltip } from '@deriv-com/ui';
import { WalletClipboard } from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import useDevice from '../../../../../hooks/useDevice';
import EditIcon from '../../../../../public/images/ic-edit.svg';
import { ChangePassword } from '../../ChangePassword';
import './MT5TradeDetailsItem.scss';

type TMT5TradeDetailsItemProps = {
    label?: string;
    value: string;
    variant?: 'clipboard' | 'info' | 'password';
};

const MT5TradeDetailsItem: FC<TMT5TradeDetailsItemProps> = ({ label, value, variant = 'clipboard' }) => {
    const { isDesktop } = useDevice();
    const { show } = useModal();
    const { localize } = useTranslations();

    return (
        <div
            className={classNames('wallets-mt5-trade-details-item', {
                'wallets-mt5-trade-details-item--info': variant === 'info',
            })}
        >
            {variant !== 'info' && (
                <React.Fragment>
                    <Text color='less-prominent' size={isDesktop ? 'xs' : 'sm'}>
                        {label}
                    </Text>
                    <div className='wallets-mt5-trade-details-item__values'>
                        <Text size={isDesktop ? 'xs' : 'sm'} weight='bold'>
                            {value}
                        </Text>
                        {variant === 'clipboard' && <WalletClipboard popoverAlignment='left' textCopy={value} />}
                        {variant === 'password' && (
                            <Tooltip
                                as='button'
                                onClick={() => show(<ChangePassword />)}
                                tooltipContent={localize('Change password')}
                                tooltipPosition='left'
                            >
                                <EditIcon className='wallets-mt5-trade-details-item__edit' />
                            </Tooltip>
                        )}
                    </div>
                </React.Fragment>
            )}
            {variant === 'info' && (
                <Text color='less-prominent' size={isDesktop ? 'xs' : 'sm'}>
                    {value}
                </Text>
            )}
        </div>
    );
};

export default MT5TradeDetailsItem;
