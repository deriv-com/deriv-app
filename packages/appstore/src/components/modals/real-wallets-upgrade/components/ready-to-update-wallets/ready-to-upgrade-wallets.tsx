import React from 'react';
import { Checkbox, Text, Icon, Div100vhContainer } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import { TReadyToUpgradeWallets } from 'Types';
import WalletsImage from 'Assets/svgs/wallets';
import getUpgradeInformationList from 'Constants/upgrade-info-lists-config';

const ReadyToUpgradeWallets = ({ is_eu, toggleCheckbox }: TReadyToUpgradeWallets) => {
    const text_body_size = isMobile() ? 'xs' : 's';
    const text_info_size = isMobile() ? 'xxs' : 'xs';
    const form_line_height = isMobile() ? 'm' : 'l';

    return (
        <Div100vhContainer className='wallet-steps__content' is_disabled={!isMobile()} height_offset='18.5rem'>
            <WalletsImage image='ready_to_update_wallets_image' className='wallet-steps__image' />
            <div className='wallet-steps__text'>
                <Text size={isMobile() ? 'xsm' : 'm'} align='center' weight='bold' line_height={form_line_height}>
                    <Localize i18n_default_text='Ready to upgrade?' />
                </Text>
                <Text size={text_body_size} align='center' line_height={form_line_height}>
                    <Localize
                        i18n_default_text="This is <0>irreversible.</0> Once you upgrade, the Cashier won't be available anymore. You'll need to
                use Wallets to deposit, withdraw, and transfer funds."
                        components={
                            <Text
                                size={text_body_size}
                                weight='bold'
                                align='center'
                                line_height={form_line_height}
                                key={0}
                            />
                        }
                    />
                </Text>
            </div>
            <div className='wallet-steps__info-section'>
                {getUpgradeInformationList({ is_eu, text_info_size, form_line_height })
                    .filter(info => info.visibility)
                    .map(({ name, content }) => (
                        <div className='wallet-steps__info-section-text' key={name}>
                            <Icon icon='ic-info-blue' />
                            <Text size={text_info_size} line_height={form_line_height}>
                                {content}
                            </Text>
                        </div>
                    ))}
            </div>
            <Checkbox
                onChange={toggleCheckbox}
                className='wallet-steps__checkbox'
                label={localize('I understand and agree to upgrade to Wallets.')}
            />
        </Div100vhContainer>
    );
};

export default ReadyToUpgradeWallets;
