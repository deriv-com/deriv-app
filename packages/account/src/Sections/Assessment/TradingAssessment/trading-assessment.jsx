import React from 'react';
import { localize } from '@deriv/translations';
import FormBody from 'Components/form-body';
import FormSubHeader from 'Components/form-sub-header';
import { trading_assessment_questions } from '../../../Configs/trading-assessment-config';
import { DesktopWrapper, Dropdown, MobileWrapper, SelectNative, Text, FormSubmitButton } from '@deriv/components';
import FormFooter from 'Components/form-footer';
import { isMobile, routes, WS } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { useHistory, withRouter } from 'react-router';
import { Formik } from 'formik';

const TradingAssessment = ({
    is_virtual,
    setFinancialAndTradingAssessment,
    setShouldShowRiskWarningModal,
    setShouldShowAppropriatenessWarningModal,
}) => {
    const history = useHistory();
    const [is_btn_loading, setIsBtnLoading] = React.useState(false);
    const [is_submit_success, setIsSubmitSuccess] = React.useState(false);
    const [initial_form_values, setInitialFormValues] = React.useState({});

    React.useEffect(() => {
        if (is_virtual) {
            history.push(routes.personal_details);
        } else {
            WS.authorized.storage.getFinancialAssessment().then(data => {
                WS.wait('get_account_status').then(() => {
                    setInitialFormValues(data.get_financial_assessment);
                });
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async values => {
        if (values.risk_tolerance === 'No') {
            setShouldShowRiskWarningModal(true);
        } else {
            setIsBtnLoading(true);
            const form_payload = {
                trading_experience_regulated: {
                    cfd_experience: values.cfd_experience,
                    cfd_frequency: values.cfd_frequency,
                    cfd_trading_definition: values.cfd_trading_definition,
                    leverage_impact_trading: values.leverage_impact_trading,
                    leverage_trading_high_risk_stop_loss: values.leverage_trading_high_risk_stop_loss,
                    required_initial_margin: values.required_initial_margin,
                    risk_tolerance: values.risk_tolerance,
                    source_of_experience: values.source_of_experience,
                    trading_experience_financial_instruments: values.trading_experience_financial_instruments,
                    trading_frequency_financial_instruments: values.trading_frequency_financial_instruments,
                },
            };
            const data = await setFinancialAndTradingAssessment(form_payload);
            const { trading_score } = data.set_financial_assessment ?? {};
            if (trading_score === 0) {
                setShouldShowAppropriatenessWarningModal(true);
                setIsBtnLoading(false);
                setIsSubmitSuccess(true);
            } else {
                setIsBtnLoading(false);
                setIsSubmitSuccess(true);
            }
            WS.authorized.storage.getFinancialAssessment().then(res_data => {
                setInitialFormValues(res_data.get_financial_assessment);
                setIsSubmitSuccess(false);
            });
        }
    };

    return (
        <Formik
            initialValues={initial_form_values}
            enableReinitialize
            onSubmit={(values, action) => handleSubmit(values, action)}
        >
            {({ values, dirty, isSubmitting, handleChange }) => {
                return (
                    <form className='account-form account-form__trading-assessment'>
                        <FormBody scroll_offset={isMobile() ? '150px' : '80px'}>
                            <FormSubHeader
                                title={localize('Trading Experience')}
                                subtitle={localize('All fields are required')}
                            />
                            {trading_assessment_questions.map(item => {
                                if (item.field_type === 'radio') {
                                    const form_control = item.form_control;
                                    return (
                                        <fieldset className='account-form__question'>
                                            <DesktopWrapper>
                                                <Text
                                                    as='h1'
                                                    color='prominent'
                                                    weight='bold'
                                                    size='xs'
                                                    className='account-form__question--text'
                                                >
                                                    {item.question_text}
                                                </Text>
                                                <Dropdown
                                                    is_align_text_left
                                                    name={form_control}
                                                    value={values[form_control]}
                                                    list={item?.answer_options}
                                                    onChange={handleChange}
                                                />
                                            </DesktopWrapper>
                                            <MobileWrapper>
                                                <Text
                                                    as='h1'
                                                    color='prominent'
                                                    weight='bold'
                                                    size='xs'
                                                    line_height='xl'
                                                    className='account-form__question--text'
                                                >
                                                    {item?.question_text}
                                                </Text>
                                                <SelectNative
                                                    value={values[form_control]}
                                                    name={form_control}
                                                    list_items={item?.answer_options}
                                                    hide_placeholder={true}
                                                    onChange={e => handleChange(e)}
                                                    should_show_empty_option={false}
                                                />
                                            </MobileWrapper>
                                        </fieldset>
                                    );
                                    // eslint-disable-next-line no-else-return
                                } else {
                                    return (
                                        <React.Fragment>
                                            {item.questions.map((items, index) => {
                                                const form_control = items.form_control;
                                                return (
                                                    <fieldset key={index} className='account-form__question'>
                                                        <DesktopWrapper>
                                                            <Text
                                                                as='h1'
                                                                color='prominent'
                                                                weight='bold'
                                                                size='xs'
                                                                className='account-form__question--text'
                                                            >
                                                                {items.question_text}
                                                            </Text>
                                                            <Dropdown
                                                                is_align_text_left
                                                                name={form_control}
                                                                value={values[form_control]}
                                                                list={items?.answer_options}
                                                                onChange={handleChange}
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <Text
                                                                as='h1'
                                                                color='prominent'
                                                                weight='bold'
                                                                size='xs'
                                                                line_height='xl'
                                                                className='account-form__question--text'
                                                            >
                                                                {items?.question_text}
                                                            </Text>
                                                            <SelectNative
                                                                value={values[form_control]}
                                                                name={form_control}
                                                                list_items={items?.answer_options}
                                                                onChange={e => handleChange(e)}
                                                                should_show_empty_option={false}
                                                            />
                                                        </MobileWrapper>
                                                    </fieldset>
                                                );
                                            })}
                                        </React.Fragment>
                                    );
                                }
                            })}
                        </FormBody>
                        <FormFooter>
                            <FormSubmitButton
                                is_disabled={isSubmitting || !dirty || is_submit_success}
                                is_loading={is_btn_loading}
                                is_absolute={isMobile()}
                                label={localize('Submit')}
                            />
                        </FormFooter>
                    </form>
                );
            }}
        </Formik>
    );
};

export default connect(({ client, ui }) => ({
    setShouldShowAppropriatenessWarningModal: ui.setShouldShowAppropriatenessWarningModal,
    setShouldShowRiskWarningModal: ui.setShouldShowRiskWarningModal,
    is_virtual: client.is_virtual,
    setFinancialAndTradingAssessment: client.setFinancialAndTradingAssessment,
    is_trading_experience_incomplete: client.is_trading_experience_incomplete,
    updateAccountStatus: client.updateAccountStatus,
}))(withRouter(TradingAssessment));
