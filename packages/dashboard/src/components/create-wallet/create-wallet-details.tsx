import React from 'react';
import { Text } from '@deriv/components';
import WalletRadioButtonGroup from './wallet-radio-button-group';
import WalletRadioButton from './wallet-radio-button';

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
            <WalletRadioButtonGroup className='create-wallet-detail__icon-array' item_count={content.length}>
                {content?.map((icon, index) => {
                    return (
                        <div key={`${icon}${index}`} className='create-wallet-detail__icon'>
                            <WalletRadioButton icon={is_dark_mode_on ? icon.dark : icon.light} />
                        </div>
                    );
                })}
            </WalletRadioButtonGroup>
        </div>
    );
};

export default CreateWalletDetails;
