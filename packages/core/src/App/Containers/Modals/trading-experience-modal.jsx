import React from 'react';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';

const TradingExperienceModal = observer(() => {
    const { client, ui } = useStore();
    const { is_trading_experience_incomplete, cfd_score } = client;
    const {
        setShouldShowTradingAssessmentModal,
        should_show_trading_assessment_modal,
        setShouldShowTradeAssessmentForm,
    } = ui;
    React.useEffect(() => {
        setShouldShowTradingAssessmentModal(cfd_score === 0);
    }, []);

    const handleOnSubmit = () => {
        setShouldShowTradingAssessmentModal(false);
        setShouldShowTradeAssessmentForm(true);
    };

    return (
        <Modal
            width='44rem'
            className='center-risk-modal'
            is_open={is_trading_experience_incomplete && should_show_trading_assessment_modal}
        >
            <Modal.Body>
                <Icon icon='IcCurrencyEurCheck' size={95} />
                <Text as='p' align='center' weight='bold' className='verified-account__text'>
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
                <Button type='button' large text={localize('OK')} primary onClick={handleOnSubmit} />
            </Modal.Footer>
        </Modal>
    );
});

export default TradingExperienceModal;
