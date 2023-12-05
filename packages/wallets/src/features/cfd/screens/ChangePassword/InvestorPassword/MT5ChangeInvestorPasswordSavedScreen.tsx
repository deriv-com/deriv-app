import React from 'react';
import { WalletButton, WalletsActionScreen, WalletText } from '../../../../../components';
import MT5PasswordUpdatedIcon from '../../../../../public/images/ic-mt5-password-updated.svg';

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
            icon={<MT5PasswordUpdatedIcon />}
            renderButtons={() => (
                <WalletButton onClick={setNextScreen} size='lg'>
                    Okay
                </WalletButton>
            )}
            title='Password saved'
        />
    );
};

export default MT5ChangeInvestorPasswordSavedScreen;
