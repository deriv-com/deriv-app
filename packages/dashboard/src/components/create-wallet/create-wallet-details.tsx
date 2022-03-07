import React from 'react';
import { Icon, Text } from '@deriv/components';

type TProps = {
    content: Array<{ light: string; dark: string }>;
    is_dark_mode_on: boolean;
    title: string;
    key: string;
};

const CreateWalletDetails: React.FC<TProps> = ({ content, is_dark_mode_on, title }) => {
    return (
        <div key={title} className='create-wallet-detail'>
            <Text align='left' size='s' weight='bold'>
                {title}
            </Text>
            <div className='create-wallet-detail__icon-array'>
                {content?.map((icon, index) => {
                    return (
                        <div key={`${icon}${index}`} className='create-wallet-detail__icon'>
                            <Icon icon={is_dark_mode_on ? icon.dark : icon.light} width={64} height={40} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CreateWalletDetails;
