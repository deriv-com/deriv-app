import React, { ComponentProps, FC } from 'react';
import { WalletDialog } from '../Base';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Text } from '@deriv-com/ui';
import { FormatUtils } from '@deriv-com/utils';
import { LabelPairedTriangleExclamationXlFillIcon } from '@deriv/quill-icons';
import './WalletCoolingOffExpirationModal.scss';

type WalletCoolingOffExpirationModalProps = ComponentProps<typeof WalletDialog> & {
    coolingOffExpirationDate: number;
};

const WalletCoolingOffExpirationModal: FC<WalletCoolingOffExpirationModalProps> = ({
    coolingOffExpirationDate,
    isVisible,
    onClose,
}) => {
    const { localize } = useTranslations();
    const expirationDate = FormatUtils.getFormattedDateString(new Date(coolingOffExpirationDate), {
        format: 'DD MMM YYYY',
    });
    const expirationTime = FormatUtils.getFormattedTimeString(new Date(coolingOffExpirationDate));

    return (
        <WalletDialog isVisible={isVisible} onClose={onClose} shouldCloseOnOverlayClick>
            <WalletDialog.Header onClose={onClose}>
                <Localize i18n_default_text='Account creation paused for 24 hours' />
            </WalletDialog.Header>
            <WalletDialog.Content className='wallets-cooling-off-expiration-modal__content'>
                <LabelPairedTriangleExclamationXlFillIcon
                    fill='var(--status-light-danger, #ec3f3f)'
                    height={126}
                    width={126}
                />
                <div className='wallets-cooling-off-expiration-modal__text'>
                    <Text align='center' as='p' size='sm'>
                        <Localize i18n_default_text="Sorry, you're unable to create an account at this time. As you declined our previous risk warnings, we need you to wait for 24 hours after your first account creation attempt before you can proceed." />
                    </Text>
                    <Text align='center' as='p' size='sm'>
                        <Localize i18n_default_text='We take your financial well-being seriously and want to ensure you are fully aware of the risks before trading.' />
                    </Text>
                    <Text align='center' as='p' size='sm'>
                        <Localize
                            i18n_default_text='Thank you for your understanding. You can create your account on {{coolDownEndDate}} or later.'
                            values={{
                                coolDownEndDate: localize('{{expirationDate}} at {{expirationTime}}', {
                                    expirationDate,
                                    expirationTime,
                                }),
                            }}
                        />
                    </Text>
                </div>
            </WalletDialog.Content>
            <WalletDialog.Footer>
                <Button onClick={onClose} size='lg' textSize='sm' variant='contained'>
                    <Localize i18n_default_text='OK' />
                </Button>
            </WalletDialog.Footer>
        </WalletDialog>
    );
};

export default WalletCoolingOffExpirationModal;
