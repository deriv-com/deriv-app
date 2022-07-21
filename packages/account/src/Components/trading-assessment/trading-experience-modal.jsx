import { Button, Icon, Modal, Text } from '@deriv/components';
import React from 'react';

const TradingExperienceModal = () => {
    return (
        <Modal width='44rem' className='center-risk-modal' is_open={true}>
            <Modal.Body>
                <Icon icon='IcCurrency-eur-check' size={95} />
                <Text as='p' size='s' align='center' weight='bold' className='verified-account__text'>
                    <Localize i18n_default_text='Trading Experience Assessment<0/>' components={[<br key={0} />]} />
                </Text>
                <Text as='p' size='xs' align='center'>
                    <Localize
                        i18n_default_text='As per our regulatory obligations, we are required to assess your trading knowledge and experience.<0/><0/>Please click ‘OK’ to continue'
                        components={[<br key={0} />]}
                    />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button type='button' large text={localize('OK')} primary />
            </Modal.Footer>
        </Modal>
    );
};

export default TradingExperienceModal;
