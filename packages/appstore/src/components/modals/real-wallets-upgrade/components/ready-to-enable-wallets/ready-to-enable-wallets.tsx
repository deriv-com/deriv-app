import React from 'react';
import { Checkbox, Text, Icon } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import WalletsImage from 'Assets/svgs/wallets';
import './ready-to-enable-wallets.scss';

type TReadyToEnableWallets = {
    value: boolean;
    toggleCheckbox: VoidFunction;
};

const ReadyToEnableWallets = observer(({ value, toggleCheckbox }: TReadyToEnableWallets) => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    const text_body_size = is_mobile ? 'xs' : 's';
    const text_info_size = is_mobile ? 'xxs' : 'xs';
    const form_line_height = is_mobile ? 'm' : 'l';

    return (
        <div className='wallet-steps__content'>
            <WalletsImage
                image={`ready_to_enable_wallets_${is_mobile ? 'mobile' : 'desktop'}`}
                className='wallet-steps__image'
            />
            <div className='wallet-steps__text'>
                <Text size={is_mobile ? 'xsm' : 'l'} align='center' weight='bold' line_height={form_line_height}>
                    <Localize i18n_default_text='Ready to enable Wallets' />
                </Text>
                <Text size={text_body_size} align='center' line_height={form_line_height}>
                    <Localize i18n_default_text='Wallets will become your dedicated fund management tool, allowing you to transfer funds between Wallets and trading accounts instantly.' />
                </Text>
            </div>
            <div className='wallet-steps__info-section'>
                <Icon className='wallet-steps__info-section-icon' icon='ic-info-blue' size={16} />
                <Text size={text_info_size} line_height={form_line_height}>
                    <Localize i18n_default_text='Your open trading positions will not be affected while we are setting up your wallets.' />
                </Text>
            </div>
            <Checkbox
                value={value}
                onChange={toggleCheckbox}
                className='wallet-steps__checkbox'
                label={localize('I acknowledge and confirm that I would like to upgrade to Wallets.')}
            />
        </div>
    );
});

export default ReadyToEnableWallets;
