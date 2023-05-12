import React from 'react';
import { Text, Icon } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { TWalletsIntro } from 'Types';
import getWalletsIntroContent from 'Constants/wallets-intro-content-config';
import './wallets-intro.scss';

type TWalletsIntroComponent = {
    is_eu: boolean;
    current_step: number;
};

const WalletsIntroComponent = ({ image, title, description, bullets }: TWalletsIntro) => {
    const text_title_size = isMobile() ? 'xsm' : 'l';
    const text_body_size = isMobile() ? 's' : 'm';
    const text_info_size = isMobile() ? 's' : 'xs';
    const form_line_height = isMobile() ? 'm' : 'l';
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
                line_height={form_line_height}
            >
                {title}
            </Text>
            <Text
                as='p'
                color='prominent'
                size={text_body_size}
                align='center'
                className='wallet-steps__description'
                line_height={form_line_height}
            >
                {description}
            </Text>
            {bullets.map(bullet => (
                <div key={bullet} className='wallet-steps__bullet'>
                    {bullet && (
                        <div className='wallet-steps__bullet-points'>
                            <Icon
                                icon='IcAppstoreTick'
                                className='wallet-steps__bullet-icon'
                                size={isMobile() ? 12 : 16}
                            />
                            <Text
                                as='p'
                                color='prominent'
                                align='center'
                                className='wallet-steps__bullet-text'
                                size={text_info_size}
                                line_height={form_line_height}
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
        {getWalletsIntroContent(is_eu).map((step, index) => {
            if (index === current_step) {
                return <WalletsIntroComponent key={index} {...step} bullets={step?.bullets || []} />;
            }
            return null;
        })}
    </div>
);

export { WalletsIntro, WalletsIntroComponent };
