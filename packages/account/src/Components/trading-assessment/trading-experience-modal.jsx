import { Button, Icon, Modal, Text } from '@deriv/components';
import React from 'react';
import { Localize, localize } from '@deriv/translations';

const TradingExperienceModal = ({ fetchFinancialAssessment, setCFDScore, cfd_score, onSubmit }) => {
    console.log('cfd_score', cfd_score);
    React.useEffect(() => {
        const fetchFinancialScore = async () => {
            try {
                const response = await fetchFinancialAssessment();
                console.log('fetchFinancialAssessment: ', response);
                setCFDScore(response?.cfd_score ?? 0);
            } catch (err) {
                console.log('Error: ', err);
            }
        };

        fetchFinancialScore();
    }, []);
    return (
        <Modal width='44rem' className='center-risk-modal' is_open={cfd_score === 0}>
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
                <Button type='button' large text={localize('OK')} primary onClick={onSubmit} />
            </Modal.Footer>
        </Modal>
    );
};

export default TradingExperienceModal;
