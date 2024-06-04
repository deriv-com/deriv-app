import React from 'react';
import { DerivLightIcMt5PasswordUpdatedIcon } from '@deriv/quill-icons';
import { WalletButton, WalletsActionScreen, WalletText } from '../../../../../components';

type TProps = {
    setNextScreen?: VoidFunction;
};

const MT5ChangeInvestorPasswordSavedScreen: React.FC<TProps> = ({ setNextScreen }) => {
    return (
        <WalletsActionScreen
            description={
                <WalletText align='center' size='sm'>
                    Your investor password has been changed.
                </WalletText>
            }
            descriptionSize='sm'
            icon={<DerivLightIcMt5PasswordUpdatedIcon height={120} width={120} />}
            renderButtons={() => (
                <WalletButton onClick={setNextScreen} size='lg'>
                    OK
                </WalletButton>
            )}
            title='Password saved'
        />
    );
};

export default MT5ChangeInvestorPasswordSavedScreen;
