import React from 'react';
import { Text } from '@deriv/components';
import { WalletRadioButton, WalletRadioButtonGroup } from 'Components/wallet-radio-button';

type TProps = {
    content: Array<any>;
    key: string;
    is_dark_mode_on: boolean;
    should_show_fiat: boolean;
    title: string;
};

const CreateWalletDetails = ({ content, is_dark_mode_on, should_show_fiat, title }: TProps) => {
    return (
        <div key={title} className='create-wallet-detail'>
            <Text align='left' size='s' weight='bold'>
                {title}
            </Text>
            <WalletRadioButtonGroup className='create-wallet-detail__icon-array' item_count={content.length}>
                {content?.map((wallet_name, index) => {
                    return (
                        <div key={`${wallet_name}${index}`} className='create-wallet-detail__icon'>
                            <WalletRadioButton
                                wallet_name={wallet_name}
                                is_dark_mode_on={is_dark_mode_on}
                                is_disabled={false}
                                should_show_fiat={should_show_fiat}
                            />
                        </div>
                    );
                })}
            </WalletRadioButtonGroup>
        </div>
    );
};

export default CreateWalletDetails;
