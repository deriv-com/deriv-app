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

    return (
        <div className='ready-to-enable-wallets__content'>
            <WalletsImage
                className='ready-to-enable-wallets__image'
                image={`ready_to_enable_wallets_${is_mobile ? 'mobile' : 'desktop'}`}
            />
            <div className='ready-to-enable-wallets__text'>
                <Text size={is_mobile ? 'xsm' : 'l'} align='center' weight='bold' line_height={is_mobile ? 'm' : 'xs'}>
                    <Localize i18n_default_text='Ready to enable Wallets' />
                </Text>
                <Text size={is_mobile ? 'xs' : 's'} align='center' line_height='m'>
                    <Localize i18n_default_text='Wallets will become your dedicated fund management tool, allowing you to transfer funds between Wallets and trading accounts instantly.' />
                </Text>
            </div>
            <div className='ready-to-enable-wallets__info-section'>
                <Icon className='ready-to-enable-wallets__info-section-icon' icon='ic-info-blue' size={16} />
                <Text size={is_mobile ? 'xxs' : 'xs'} line_height='m'>
                    <Localize i18n_default_text='Your open trading positions will not be affected while we are setting up your wallets.' />
                </Text>
            </div>
            <Checkbox
                value={value}
                onChange={toggleCheckbox}
                className='ready-to-enable-wallets__checkbox'
                label={localize('I acknowledge and confirm that I would like to upgrade to Wallets.')}
                label_font_size={is_mobile ? 'xxs' : 'xs'}
            />
        </div>
    );
});

export default ReadyToEnableWallets;
