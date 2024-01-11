import { TestWarningModal } from '@deriv/account';
import { Button, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { routes } from '@deriv/shared';
import React from 'react';
import { observer, useStore } from '@deriv/stores';

const RiskAcceptTestWarningModal = observer(() => {
    const { ui } = useStore();
    const {
        should_show_risk_accept_modal,
        setShouldShowWarningModal,
        setShouldShowAssessmentCompleteModal,
        setIsTradingAssessmentForNewUserEnabled,
    } = ui;
    const handleAcceptAppropriatenessTestWarning = () => {
        setShouldShowWarningModal(false);
        if (window.location.href.includes(routes.trading_assessment)) {
            setShouldShowAssessmentCompleteModal(false);
        } else {
            setShouldShowAssessmentCompleteModal(true);
            setIsTradingAssessmentForNewUserEnabled(true);
        }
    };

    return (
        <TestWarningModal
            show_risk_modal={should_show_risk_accept_modal}
            body_content={
                <Text as='p' size='xs'>
                    <Localize
                        i18n_default_text='In providing our services to you, we are required to ask you for some information to assess if a given product or service is appropriate for you and whether you have the experience and knowledge to understand the risks involved.<0/><0/>'
                        components={[<br key={0} />]}
                    />
                    <Localize
                        i18n_default_text='Based on your answers, it looks like you have insufficient knowledge and experience in trading CFDs. CFD trading is risky and you could potentially lose all of your capital.<0/><0/>'
                        components={[<br key={0} />]}
                    />
                    <Localize i18n_default_text='Please note that by clicking ‘OK’, you may be exposing yourself to risks. You may not have the knowledge or experience to properly assess or mitigate these risks, which may be significant, including the risk of losing the entire sum you have invested.' />
                </Text>
            }
            footer_content={
                <Button
                    type='button'
                    large
                    text={localize('OK')}
                    primary
                    onClick={handleAcceptAppropriatenessTestWarning}
                />
            }
        />
    );
});

export default RiskAcceptTestWarningModal;
