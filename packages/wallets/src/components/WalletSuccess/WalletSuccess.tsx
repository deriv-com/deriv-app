import React, { ReactNode } from 'react';
import { WalletText } from '../Base';
import './WalletSuccess.scss';

type TSuccessProps = {
    description: string;
    renderButton?: () => ReactNode;
    renderIcon: () => ReactNode;
    title: string;
};

const WalletSuccess: React.FC<TSuccessProps> = ({ description, renderButton, renderIcon, title }) => {
    return (
        <div className='wallets-success'>
            {renderIcon()}
            <div className='wallets-success__content'>
                <WalletText align='center' weight='bold'>
                    {title}
                </WalletText>
                <WalletText align='center' size='sm'>
                    {description}
                </WalletText>
            </div>
            {renderButton && renderButton()}
        </div>
    );
};

export default WalletSuccess;
