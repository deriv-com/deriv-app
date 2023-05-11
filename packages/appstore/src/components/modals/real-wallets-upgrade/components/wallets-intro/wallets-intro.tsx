import React from 'react';
import { Text, Icon } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { TWalletsIntro } from 'Types';
import getWalletIntroContent from 'Constants/wallet-intro-content-config';
import './wallets-intro.scss';

type TWalletsIntroComponent = {
    is_eu: boolean;
    current_step: number;
};

const WalletsIntroComponent = ({ image, title, description, bullets }: TWalletsIntro) => {
    const text_title_size = isMobile() ? 'xsm' : 'l';
    const text_body_size = isMobile() ? 's' : 'm';
    const text_info_size = isMobile() ? 's' : 'xs';
    return (
        <React.Fragment>
            {image}
            <Text
                as='h1'
                color='prominent'
                weight='bold'
                align='center'
                size={text_title_size}
                className='wallet-steps__title'
            >
                {title}
            </Text>
            <Text as='p' color='prominent' size={text_body_size} align='center' className='wallet-steps__description'>
                {description}
            </Text>
            {bullets.map(bullet => (
                <div key={bullet} className='wallet-steps__bullet'>
                    {bullet && (
                        <div className='wallet-steps__bullet-points'>
                            <Icon icon='IcAppstoreTick' className='wallet-steps__bullet-icon' />
                            <Text
                                as='p'
                                color='prominent'
                                align='center'
                                className='wallet-steps__bullet-text'
                                size={text_info_size}
                            >
                                {bullet}
                            </Text>
                        </div>
                    )}
                </div>
            ))}
        </React.Fragment>
    );
};

const WalletsIntro = ({ is_eu, current_step }: TWalletsIntroComponent) => (
    <div className='wallet-steps__content'>
        {getWalletIntroContent(is_eu).map((step, index) => {
            if (index === current_step) {
                return <WalletsIntroComponent key={index} {...step} bullets={step?.bullets || []} />;
            }
            return null;
        })}
    </div>
);

export { WalletsIntro, WalletsIntroComponent };
