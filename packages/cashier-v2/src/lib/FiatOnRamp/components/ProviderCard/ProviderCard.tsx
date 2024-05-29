import React from 'react';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { IconMarquee } from '../../../../components';
import type { TFiatOnRampProvider } from '../../types';
import styles from './ProviderCard.module.scss';

type TProps = {
    handleDisclaimerDialog: (isOpen: boolean, providerServiceName?: TFiatOnRampProvider['serviceName']) => void;
    provider: TFiatOnRampProvider;
};

const theme = 'light';

const ProviderCard: React.FC<TProps> = ({ handleDisclaimerDialog, provider }) => {
    const { isMobile } = useDevice();
    const { description, logo, name, paymentMethodIcons, serviceName } = provider;
    const { dark: LogoDark, light: LogoLight } = logo;

    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                {theme === 'light' ? <LogoLight data-testid='dt_logo' /> : <LogoDark data-testid='dt_logo' />}
            </div>
            <div className={styles.content}>
                <Text color='prominent' size='md' weight='bold'>
                    {name}
                </Text>
                <Text size='sm'>{description}</Text>
                {!isMobile && (
                    <IconMarquee hasRightShadow iconHeight={40} iconWidth={40} icons={paymentMethodIcons[theme]} />
                )}
            </div>
            {isMobile && (
                <div className={styles['mobile-icons']}>
                    <IconMarquee hasRightShadow iconHeight={40} iconWidth={40} icons={paymentMethodIcons[theme]} />
                </div>
            )}
            <Button
                className={styles['select-btn']}
                onClick={() => handleDisclaimerDialog(true, serviceName)}
                size='md'
            >
                Select
            </Button>
        </div>
    );
};

export default ProviderCard;
