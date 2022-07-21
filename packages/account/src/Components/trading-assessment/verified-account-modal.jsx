import React from 'react';
import { Modal, Text, Icon, Button } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const VerifiedAccountModal = ({ onSubmit, onCancel, fetchFinancialAssessment, setCFDScore, cfd_score }) => {
    React.useEffect(() => {
        const fetchFinancialScore = async () => {
            try {
                const response = await fetchFinancialAssessment();
                console.log('Response: ', response);
                setCFDScore(response?.cfd_score ?? 0);
            } catch (err) {
                console.log('Error: ', err);
            }
        };

        fetchFinancialScore();
    }, []);

    return (
        <Modal width='44rem' is_open={true} className='center-risk-modal'>
            <Modal.Body>
                <Icon icon='IcCurrency-eur-check' size={95} />
                <Text as='p' size='s' align='center' weight='bold' className='verified-account__text'>
                    <Localize i18n_default_text='Your account is ready<0/>' components={[<br key={0} />]} />
                </Text>
                <Text as='p' size='xs' align='center'>
                    <Localize i18n_default_text='We need proofs of your identity and address before you can start trading.' />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button type='button' large secondary text={localize('Maybe Later')} onClick={() => onCancel(false)} />
                <Button type='button' large primary text={localize('Submit Proof')} onClick={onSubmit} />
            </Modal.Footer>
        </Modal>
    );
};

// export default connect(({ client }) => ({
//     fetchFinancialAssessment: client.fetchFinancialAssessment,
//     setCFDScore: client.setCFDScore,
//     cfd_score: client.cfd_score,
// }))(VerifiedAccountModal);

export default VerifiedAccountModal;
