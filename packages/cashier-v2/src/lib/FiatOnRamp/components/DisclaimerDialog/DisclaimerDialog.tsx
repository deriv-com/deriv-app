import React from 'react';
import { useMutation } from '@deriv/api-v2';
import { Button, Dialog, Text } from '@deriv-com/ui';
import { capitalizeFirstLetter } from '../../../../utils';
import type { TFiatOnRampProvider } from '../../types';
import styles from './DisclaimerDialog.module.scss';

type TProps = {
    handleDisclaimerDialog: (isOpen: boolean, providerServiceName?: TFiatOnRampProvider['serviceName']) => void;
    isOpen: boolean;
    providerServiceName: TFiatOnRampProvider['serviceName'];
};

const DisclaimerDialog: React.FC<TProps> = ({ handleDisclaimerDialog, isOpen, providerServiceName }) => {
    const { isLoading, mutateAsync } = useMutation('service_token');
    const providerName = capitalizeFirstLetter(providerServiceName ?? '');

    const redirectToProvider = () => {
        if (!providerServiceName) return;

        mutateAsync({ payload: { referrer: window.location.href, service: providerServiceName } })
            .then(({ service_token: serviceToken }) => {
                const url = serviceToken?.[providerServiceName]?.url ?? '';
                if (url) {
                    window.open(url, '_blank');
                }
            })
            .finally(() => {
                handleDisclaimerDialog(false);
            });
    };

    return (
        <Dialog className={styles.container} isOpen={isOpen} shouldCloseOnOverlayClick>
            <Dialog.Header
                className={styles.header}
                hideCloseIcon={false}
                onRequestClose={() => handleDisclaimerDialog(false)}
            />
            <Dialog.Body className={styles.body}>
                <Text as='p' color='prominent' size='md' weight='bold'>
                    Disclaimer
                </Text>
                <Text as='p' size='sm'>
                    {`By clicking 'Continue' you will be redirected to ${providerName}, a third-party payment service
                    provider. Please note that Deriv is not responsible for the content or services
                    provided by ${providerName}. If you encounter any issues related to ${providerName} services, you must
                    contact ${providerName} directly.`}
                </Text>
            </Dialog.Body>
            <Dialog.Footer className={styles.footer}>
                <Button
                    color='black'
                    onClick={() => handleDisclaimerDialog(false)}
                    size='lg'
                    textSize='sm'
                    variant='outlined'
                >
                    Cancel
                </Button>
                <Button disabled={isLoading} isLoading={isLoading} onClick={redirectToProvider} size='lg' textSize='sm'>
                    Continue
                </Button>
            </Dialog.Footer>
        </Dialog>
    );
};

export default DisclaimerDialog;
