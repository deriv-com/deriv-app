import React from 'react';
import { DerivLightIcMt5PasswordUpdatedIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { WalletButton, WalletsActionScreen } from '../../../../../components';

type TProps = {
    setNextScreen?: VoidFunction;
};

const MT5ChangeInvestorPasswordSavedScreen: React.FC<TProps> = ({ setNextScreen }) => {
    return (
        <WalletsActionScreen
            description={
                <Text align='center' size='sm'>
                    <Localize i18n_default_text='Your investor password has been changed.' />
                </Text>
            }
            descriptionSize='sm'
            icon={<DerivLightIcMt5PasswordUpdatedIcon height={120} width={120} />}
            renderButtons={() => (
                <WalletButton onClick={setNextScreen} size='lg'>
                    <Localize i18n_default_text='OK' />
                </WalletButton>
            )}
            title={<Localize i18n_default_text='Password saved' />}
        />
    );
};

export default MT5ChangeInvestorPasswordSavedScreen;
