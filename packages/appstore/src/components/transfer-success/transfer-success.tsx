import React from 'react';
import { Icon, Money } from '@deriv/components';
import { Button, Text } from '@deriv/ui';
import { localize } from '@deriv/translations';

type TTransferSuccessProps = {
    amount_send_from_wallet: React.ReactNode;
    amount_received_to_wallet: React.ReactNode;
    currency: string;
    amount: number;
    trading_platform?: string;
};

const TransferSuccess = ({
    amount_send_from_wallet,
    amount_received_to_wallet,
    currency,
    amount,
    trading_platform,
}: TTransferSuccessProps) => {
    return (
        <>
            <div className='transfer-success'>
                <div className='transfer-success__wallets'>
                    {amount_send_from_wallet}
                    <Icon
                        className='transfer-success__icon'
                        icon='IcAppstoreTransferArrowLine'
                        width='56'
                        height='36'
                    />
                    <div className='transfer-success__received-to'>{amount_received_to_wallet}</div>
                </div>
                <div className='transfer-success__success-text'>
                    <Text type='subtitle-1' bold>
                        <Money currency={currency} amount={amount} should_format={true} show_currency={true} />
                    </Text>
                    <Text type='subtitle-2' bold>
                        {localize('Your transfer is successful!')}
                    </Text>
                    <div className='transfer-success__button'>
                        {!trading_platform ? (
                            <>
                                <Button color='primary'>{localize('Trade')}</Button>
                                <Button color='secondary'>{localize('Close')}</Button>
                            </>
                        ) : (
                            <Button color='primary'>{localize(`Trade with ${trading_platform}`)}</Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TransferSuccess;
