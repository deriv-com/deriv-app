import React, { ComponentProps, ReactNode } from 'react';
import { ActionScreen } from '@deriv-com/ui';
import './WalletSuccess.scss';

type TSuccessProps = {
    actionButtons?: ComponentProps<typeof ActionScreen>['actionButtons'];
    description: ReactNode;
    renderIcon: () => ReactNode;
    title: ReactNode;
};

const WalletSuccess: React.FC<TSuccessProps> = ({ actionButtons, description, renderIcon, title }) => {
    return (
        <div className='wallets-success'>
            <ActionScreen
                actionButtons={actionButtons}
                description={description}
                descriptionSize='sm'
                icon={renderIcon()}
                title={title}
            />
        </div>
    );
};

export default WalletSuccess;
