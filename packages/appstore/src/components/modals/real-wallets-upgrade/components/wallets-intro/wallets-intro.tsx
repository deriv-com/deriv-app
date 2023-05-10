import React from 'react';
import { Text, Icon, Div100vhContainer } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { TWalletsIntro } from 'Types';
import getWalletIntroContent from 'Constants/wallet-intro-content-config';
import './wallet-steps.scss';

type TWalletsIntroComponent = {
    is_eu: boolean;
    current_step: number;
};

const WalletsIntroComponent = ({ image, title, description, bullets }: TWalletsIntro) => (
    <React.Fragment>
        {image}
        <Text
            as='h1'
            color='prominent'
            weight='bold'
            align='center'
            size={isDesktop ? 'l' : 'm'}
            className='wallet-steps__title'
        >
            {title}
        </Text>
        <Text
            as='p'
            color='prominent'
            size={isDesktop ? 'm' : 's'}
            align='center'
            className='wallet-steps__description'
        >
            {description}
        </Text>
        {bullets.map(bullet => (
            <div key={bullet} className='wallet-steps__bullet'>
                {bullet && (
                    <div className='wallet-steps__bullet-points'>
                        <Icon icon='IcAppstoreTick' className='wallet-steps__bullet-icon' />
                        <Text as='p' color='prominent' align='center' className='wallet-steps__bullet-text'>
                            {bullet}
                        </Text>
                    </div>
                )}
            </div>
        ))}
    </React.Fragment>
);

const WalletsIntro = ({ is_eu, current_step }: TWalletsIntroComponent) => (
    <Div100vhContainer className='wallet-steps__content' is_disabled={isDesktop()} height_offset='18.5rem'>
        {getWalletIntroContent(is_eu).map((step, index) => {
            if (index === current_step) {
                return <WalletsIntroComponent key={index} {...step} bullets={step?.bullets || []} />;
            }
            return null;
        })}
    </Div100vhContainer>
);

export default WalletsIntro;
