import React from 'react';
import { Text, Icon } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { useStore } from '@deriv/stores';
import './why-wallets.scss';
import WalletsImage from 'Assets/svgs/wallets';

const WhyWallets = () => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    const bullets = [
        localize('Better funds segregation'),
        localize('Instant transfers between Wallets and trading accounts'),
        localize('Multiple currency support'),
    ];

    const text_title_size = is_mobile ? 'xsm' : 'l';
    const text_body_size = is_mobile ? 's' : 'm';
    const text_info_size = is_mobile ? 'xs' : 's';
    const form_line_height = is_mobile ? 'm' : 'l';

    return (
        <div className='wallet-steps__content why-wallets__content'>
            <React.Fragment>
                <div className='why-wallets__image-container'>
                    <WalletsImage image={`why_wallets_${is_mobile ? 'mobile' : 'desktop'}`} />
                </div>
                <Text
                    as='h1'
                    color='prominent'
                    weight='bold'
                    align='center'
                    size={text_title_size}
                    className='why-wallets__title'
                    line_height={form_line_height}
                >
                    <Localize i18n_default_text='Why Wallets' />
                </Text>
                <Text
                    as='p'
                    color='prominent'
                    size={text_body_size}
                    align='center'
                    className='why-wallets__description'
                    line_height={form_line_height}
                >
                    <Localize i18n_default_text='Deposit, transfer, trade' />
                </Text>
                <div className='why-wallets__bullet-list-container'>
                    {bullets.map(bullet => (
                        <div key={bullet} className='why-wallets__bullet'>
                            {bullet && (
                                <div className='why-wallets__bullet-points'>
                                    <Icon
                                        icon='IcAppstoreTick'
                                        className='why-wallets__bullet-icon'
                                        size={is_mobile ? 12 : 16}
                                    />
                                    <Text
                                        as='p'
                                        color='prominent'
                                        align='center'
                                        className='why-wallets__bullet-text'
                                        size={text_info_size}
                                        line_height={form_line_height}
                                    >
                                        {bullet}
                                    </Text>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </React.Fragment>
        </div>
    );
};

export default WhyWallets;
