import React from 'react';
import { Button, Modal, DesktopWrapper, MobileDialog, MobileWrapper, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import {
    RiskToleranceWarningModal,
    TradingAssessmentForm,
    TestWarningModal,
    tradingAssessmentConfig,
} from '@deriv/account';

const TradingAssessmentExistingUser = ({
    should_show_trade_assessment_form,
    setFinancialAndTradingAssessment,
    should_show_risk_tolerance_warning_modal,
    setShouldShowRiskToleranceWarningModal,
    should_show_appropriateness_test_warning_modal,
    setShouldShowAppropriatenessTestWarningModal,
}) => {
    const [form_values, setStateItems] = React.useState({});

    const { form_value, props } = tradingAssessmentConfig({ real_account_signup_target: 'maltainvest' }, null);

    React.useEffect(() => {
        const initial_fields = form_value;
        setStateItems(initial_fields);
    }, []);

    const handleSubmit = async values => {
        const form_payload = {
            trading_experience_maltainvest: { ...values },
        };
        try {
            const response = await setFinancialAndTradingAssessment(form_payload);
        } catch (error) {
            if (error.code === 'AppropriatenessTestFailed') {
                //pass
                setShouldShowRiskToleranceWarningModal(true);
            }
        }
    };

    const handleAcceptAppropriatenessTestWarning = () => {
        setShouldShowAppropriatenessTestWarningModal(false);
    };

    if (should_show_risk_tolerance_warning_modal) {
        <RiskToleranceWarningModal
            show_risk_modal={should_show_risk_tolerance_warning_modal}
            setShowRiskModal={setShouldShowRiskToleranceWarningModal}
            title={localize('Risk Tolerance Warning')}
            button_text={localize('Yes, I understand the risk.')}
        />;
    } else if (should_show_appropriateness_test_warning_modal) {
        return (
            <TestWarningModal
                show_risk_modal={should_show_appropriateness_test_warning_modal}
                body_content={
                    <Text as='p' size='xs'>
                        <Localize
                            i18n_default_text='In providing our services to you, we are required to ask you for some information to assess if a given product or service is appropriate for you and whether you have the experience and knowledge to understand the risks involved.<0/><1/>'
                            components={[<br key={0} />, <br key={1} />]}
                        />
                        <Localize
                            i18n_default_text='Based on your answers, it looks like you have insufficient knowledge and experience in trading CFDs. CFD trading is risky and you could potentially lose all of your capital.'
                            components={[<br key={0} />, <br key={1} />]}
                        />
                        <Localize i18n_default_text='Please note that by clicking ‘OK’, you may be exposing yourself to risks. You may not have the knowledge or experience to properly assess or mitigate these risks, which may be significant, including the risk of losing the entire sum you have invested' />
                    </Text>
                }
                footer_content={
                    <React.Fragment>
                        <Button
                            type='button'
                            large
                            text={localize('OK')}
                            primary
                            onClick={handleAcceptAppropriatenessTestWarning}
                        />
                    </React.Fragment>
                }
            />
        );
    }

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    is_open={should_show_trade_assessment_form}
                    title={localize('Trading Experience Assessment')}
                    width='904px'
                    has_close_icon={false}
                >
                    <TradingAssessmentForm
                        assessment_questions={props.assessment_questions}
                        form_values={form_values}
                        onSubmit={handleSubmit}
                    />
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    visible={should_show_trade_assessment_form}
                    title={localize('Trading Experience Assessment')}
                    portal_element_id='modal_root'
                >
                    <TradingAssessmentForm
                        assessment_questions={props.assessment_questions}
                        value={form_values}
                        onSubmit={handleSubmit}
                    />
                </MobileDialog>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default connect(({ client, ui }) => ({
    setFinancialAndTradingAssessment: client.setFinancialAndTradingAssessment,
    should_show_risk_tolerance_warning_modal: client.should_show_risk_tolerance_warning_modal,
    setShouldShowRiskToleranceWarningModal: client.setShouldShowRiskToleranceWarningModal,
    should_show_appropriateness_test_warning_modal: ui.should_show_appropriateness_test_warning_modal,
    setShouldShowAppropriatenessTestWarningModal: ui.setShouldShowAppropriatenessTestWarningModal,
    should_show_trade_assessment_form: ui.should_show_trade_assessment_form,
}))(TradingAssessmentExistingUser);
