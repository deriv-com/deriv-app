import React from 'react';
import { Localize } from '@deriv-com/translations';
import { ActionScreen, Button, Text, useDevice } from '@deriv-com/ui';

type TProps = {
    sendEmail?: VoidFunction;
};

const MT5ChangeInvestorPasswordInputsScreen: React.FC<TProps> = ({ sendEmail }) => {
    const { isDesktop } = useDevice();
    const textSize = isDesktop ? 'sm' : 'md';

    return (
        <ActionScreen
            actionButtons={
                <Button onClick={sendEmail} size='lg' textSize={textSize}>
                    <Localize i18n_default_text='Create or reset investor password' />
                </Button>
            }
            description={
                <div className='wallets-change-investor-password-screens__description'>
                    <Text align='start' size={textSize}>
                        <Localize i18n_default_text='Use this password to grant viewing access to another user. While they may view your trading account, they will not be able to trade or take any other actions.' />
                    </Text>
                </div>
            }
            descriptionSize='sm'
        />
    );
};

export default MT5ChangeInvestorPasswordInputsScreen;
