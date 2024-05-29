import React, { useState } from 'react';
import { Text } from '@deriv-com/ui';
import { DisclaimerDialog, ProviderCard } from './components';
import { fiatOnRampProviders } from './constants';
import type { TFiatOnRampProvider } from './types';
import styles from './FiatOnRamp.module.scss';

const FiatOnRamp = () => {
    const [isDisclaimerDialogOpen, setIsDisclaimerDialogOpen] = useState(false);
    const [selectedProviderServiceName, setSelectedProviderServiceName] =
        useState<TFiatOnRampProvider['serviceName']>();

    const handleDisclaimerDialog = (isOpen: boolean, providerServiceName: TFiatOnRampProvider['serviceName']) => {
        setSelectedProviderServiceName(providerServiceName);
        setIsDisclaimerDialogOpen(isOpen);
    };

    return (
        <div className={styles.container}>
            <Text className={styles.title} size='md' weight='bold'>
                Select payment channel
            </Text>
            {fiatOnRampProviders.map(provider => {
                return (
                    <ProviderCard
                        handleDisclaimerDialog={handleDisclaimerDialog}
                        key={provider.name}
                        provider={provider}
                    />
                );
            })}
            <DisclaimerDialog
                handleDisclaimerDialog={handleDisclaimerDialog}
                isOpen={isDisclaimerDialogOpen}
                providerServiceName={selectedProviderServiceName}
            />
        </div>
    );
};

export default FiatOnRamp;
