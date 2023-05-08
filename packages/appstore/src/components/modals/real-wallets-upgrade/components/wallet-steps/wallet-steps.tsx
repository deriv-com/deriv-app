import React from 'react';
import { Modal, Text, Icon, Div100vhContainer } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { TStepProps } from 'Types';
import { steps } from 'Constants/wallet-static-steps-config';
import './wallet-steps.scss';

type TStepComponent = {
    eu_user: boolean;
    current_step: number;
};

const WalletSteps = ({ icon, title, description, bullets }: TStepProps) => (
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
);

// move this in a seperate file
const StepComponent = ({ eu_user, current_step }: TStepComponent) => (
    <Modal.Body className='wallet-steps'>
        {steps(eu_user).map((step, index) => {
            if (index === current_step - 1) {
                return <WalletSteps key={index} {...step} bullets={step?.bullets || []} />;
            }
            // replace this with the consent form or whatever
            return null;
        })}
    </Modal.Body>
);

export default StepComponent;
