import React from 'react';
import { WalletButton, WalletsActionScreen, WalletText } from '../../../../../components';
import MT5PasswordUpdatedIcon from '../../../../../public/images/ic-mt5-password-updated.svg';

type TProps = {
    setNextScreen?: VoidFunction;
};

const MT5ChangeInvestorPasswordSavedScreen: React.FC<TProps> = ({ setNextScreen }) => {
    return (
        <div className='wallets-change-password__content'>
            <WalletsActionScreen
                description={
                    <WalletText align='center' size='sm'>
                        Your investor password has been changed.
                    </WalletText>
                }
                descriptionSize='sm'
                icon={<MT5PasswordUpdatedIcon />}
                renderButtons={() => <WalletButton onClick={setNextScreen} size='lg' text='Okay' />}
                title='Password saved'
            />
        </div>
    );
};

export default MT5ChangeInvestorPasswordSavedScreen;
