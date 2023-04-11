import React from 'react';
import { Modal, Text, Icon, Div100vhContainer } from '@deriv/components';
import './wallet-steps.scss';
import { isDesktop } from '@deriv/shared';
import { TStepProps } from 'Types';

const WalletSteps = ({ icon, title, description, bullets }: TStepProps) => {
    return (
        <React.Fragment>
            <Modal.Body className='wallet-steps'>
                <Div100vhContainer className='wallet-steps__content' is_disabled={isDesktop()} height_offset='15rem'>
                    {icon}
                    <Text
                        as='h1'
                        color='prominent'
                        weight='bold'
                        align='center'
                        size={isDesktop ? 'l' : 'm'}
                        className='wallet-steps-title'
                    >
                        {title}
                    </Text>
                    <Text
                        as='p'
                        color='prominent'
                        size={isDesktop ? 'm' : 's'}
                        align='center'
                        className='wallet-steps-description'
                    >
                        {description}
                    </Text>
                    {bullets.map(bullet => (
                        <div key={bullet} className='wallet-steps-bullet'>
                            {bullet && (
                                <React.Fragment>
                                    <Icon icon='IcAppstoreTick' />
                                    <Text as='p' color='prominent' align='center' className='wallet-steps-bullet-text'>
                                        {bullet}
                                    </Text>
                                </React.Fragment>
                            )}
                        </div>
                    ))}
                </Div100vhContainer>
            </Modal.Body>
        </React.Fragment>
    );
};

export default WalletSteps;
