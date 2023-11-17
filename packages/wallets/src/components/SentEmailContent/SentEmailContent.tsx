import React from 'react';
import { PlatformDetails } from '../../features/cfd/constants';
import useDevice from '../../hooks/useDevice';
import ChangePassword from '../../public/images/change-password-email.svg';
import { TPlatforms } from '../../types';
import { WalletButton } from '../Base';
import { WalletsActionScreen } from '../WalletsActionScreen';
import './SentEmailContent.scss';

type TProps = {
    platform?: TPlatforms.All;
};

const SentEmailContent: React.FC<TProps> = ({ platform }) => {
    const { isMobile } = useDevice();
    const title = PlatformDetails[platform || 'mt5'].title;
    const deviceSize = isMobile ? 'lg' : 'md';
    return (
        <div className='wallets-sent-email-content'>
            <WalletsActionScreen
                description={`Please click on the link in the email to change your ${title} password.`}
                descriptionSize={deviceSize}
                icon={<ChangePassword />}
                renderButtons={() => (
                    <WalletButton size={deviceSize} text="Didn't receive the email?" variant='ghost' />
                )}
                title='We’ve sent you an email'
                titleSize={deviceSize}
            />
        </div>
    );
};

export default SentEmailContent;
