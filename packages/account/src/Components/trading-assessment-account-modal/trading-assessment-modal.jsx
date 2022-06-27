import { Button, Div100vhContainer, Modal } from '@deriv/components';
import { localize } from '@deriv/translations';
import Icon from '../icon';
import React from 'react';

const getAssessmentModalContent = () => {
    return [
        {
            key: 'risk_warning',
            icon: 'ICAlertDanger',
            content: localize(
                'CFDs and other Financial Instruments come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs and other Financial Instruments work and whether you can afford to take the high risk of losing your money.'
            ),
            message: localize('To continue, you must confirm that you understand your capital is at risk.'),
        },
        {
            key: 'trading_experience',
            icon: 'ICCurrencyEuro',
            content: localize(
                'As per our regulatory obligations, we are required to assess your trading knowledge and experience.'
            ),
            message: localize('Please click ‘OK’ to continue'),
        },
        {
            key: 'completed_assessment',
            icon: 'IcCheckmark',
            content: localize('Thank you! Your response has been recorded into our system.'),
            message: localize('Please click ‘OK’ to continue'),
        },
    ];
};

const TAModal = ({is_open, onClose}) => {
    return (
    <Modal
    className={'trading-assessment__modal'}
    is_open={is_open}
    should_header_stick_body
    title=''
    toggleModal={onClose}
    >
     <Div100vhContainer
        className='account__scrollbars_container-wrapper'
     >
        <Modal.Body>
            <div>
                <Icon 
                icon={getAssessmentModalContent.icon} 
                color='active' 
                size={24}/>
                {getAssessmentModalContent.content}
            </div>
        </Modal.Body>
        <Modal.Footer>
                {getAssessmentModalContent.message}
                <Button
                className=''
                primary
                text={'OK'}
                onClick={onClose}
                />
        </Modal.Footer>
    </Div100vhContainer>   
    <Modal/>
    );
};

export default TAModal;
