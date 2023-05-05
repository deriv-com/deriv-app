import React from 'react';
import { Modal, Text, Icon, Div100vhContainer } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { TStepProps } from 'Types';
import './wallet-steps.scss';

const WalletSteps = ({ icon, title, description, bullets }: TStepProps) => {
    return (
        <React.Fragment>
            <Modal.Body className='wallet-steps'>
                <Div100vhContainer className='wallet-steps__content' is_disabled={isDesktop()} height_offset='18.5rem'>
                    {icon}
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
                </Div100vhContainer>
            </Modal.Body>
        </React.Fragment>
    );
};

export default WalletSteps;
