// import PropTypes        from 'prop-types';
import React from 'react';
import { Formik } from 'formik';
import { withRouter } from 'react-router';
import { Button, Dropdown, Modal, Icon } from '@deriv/components';
import { isMobile, isDesktop } from '@deriv/shared/utils/screen';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import AppRoutes from 'Constants/routes';
import { WS } from 'Services/ws-methods';
import {
    account_turnover_list,
    education_level_list,
    employment_industry_list,
    employment_status_list,
    estimated_worth_list,
    income_source_list,
    net_income_list,
    occupation_list,
    source_of_wealth_list,
} from './financial-information-list';
import DemoMessage from '../../ErrorMessages/DemoMessage';
import LoadErrorMessage from '../../ErrorMessages/LoadErrorMessage';
import FormSubmitErrorMessage from '../../ErrorMessages/FormSubmitErrorMessage';

import { FormBody, FormSubHeader, FormFooter } from '../../../Components/layout-components.jsx';
import { LeaveConfirm } from '../../../Components/leave-confirm.jsx';
import IconMessageContent from '../../../Components/icon-message-content.jsx';
import Loading from '../../../../../templates/app/components/loading.jsx';

const ConfirmationContent = ({ className }) => {
    return (
        <React.Fragment>
            <p className={className}>
                <Localize
                    i18n_default_text='In providing our services to you, we are required to obtain information from you in order to assess
                whether a given product or service is appropriate for you (that is, whether you possess the experience
                and knowledge to understand the risks involved).<0/><1/>'
                    components={[<br key={0} />, <br key={1} />]}
                />
                <Localize
                    i18n_default_text='On the basis of the information provided in relation to your knowledge and experience, we consider that
                    the investments available via this website are not appropriate for you.<0/><1/>'
                    components={[<br key={0} />, <br key={1} />]}
                />
                <Localize
                    i18n_default_text='By clicking Accept below and proceeding with the Account Opening you should note that you may be
                    exposing yourself to risks (which may be significant, including the risk of loss of the entire sum
                    invested) that you may not have the knowledge and experience to properly assess or mitigate.'
                />
            </p>
        </React.Fragment>
    );
};

const ConfirmationModal = ({ is_visible, toggleModal, onSubmit }) => (
    <Modal
        className='financial-assessment-confirmation'
        is_open={is_visible}
        small
        toggleModal={() => toggleModal(false)}
        title={localize('Appropriateness Test, WARNING:')}
    >
        <Modal.Body>
            <ConfirmationContent />
        </Modal.Body>
        <Modal.Footer>
            <Button large text={localize('Decline')} onClick={() => toggleModal(false)} secondary />
            <Button
                large
                text={localize('Accept')}
                onClick={() => {
                    onSubmit();
                    toggleModal(false);
                }}
                primary
            />
        </Modal.Footer>
    </Modal>
);

const ConfirmationPage = ({ toggleModal, onSubmit }) => (
    <div className='account__confirmation-page'>
        <span className='account__confirmation-page-title'>{localize('Notice')}</span>
        <ConfirmationContent className='account__confirmation-page-content' />
        <div className='account__confirmation-page-footer'>
            <Button large text={localize('Back')} onClick={() => toggleModal(false)} secondary />
            <Button
                large
                text={localize('Accept')}
                onClick={() => {
                    onSubmit();
                    toggleModal(false);
                }}
                primary
            />
        </div>
    </div>
);

const SubmittedPage = withRouter(({ history }) => {
    const redirectToPOA = () => {
        history.push(AppRoutes.proof_of_address);
    };
    return (
        <IconMessageContent
            className='submit-success'
            message={localize('Financial assessment submitted successfully')}
            text={localize('Let’s continue with providing proofs of address and identity.')}
            icon={<Icon icon='IcSuccess' width={96} height={90} />}
        >
            <div className='account-management-flex-wrapper account-management-submit-success'>
                <Button
                    type='button'
                    has_effect
                    text={localize('Continue')}
                    onClick={() => redirectToPOA()}
                    primary
                    large
                />
            </div>
        </IconMessageContent>
    );
});

class FinancialAssessment extends React.Component {
    state = {
        is_loading: true,
        is_confirmation_visible: false,
        show_form: true,
        income_source: '',
        employment_status: '',
        employment_industry: '',
        occupation: '',
        source_of_wealth: '',
        education_level: '',
        net_income: '',
        estimated_worth: '',
        account_turnover: '',
    };

    componentDidMount() {
        if (this.props.is_virtual) {
            this.setState({ is_loading: false });
        } else {
            WS.authorized.storage.getFinancialAssessment().then(data => {
                if (data.error) {
                    this.setState({ api_initial_load_error: data.error.message });
                    return;
                }
                this.setState({ ...data.get_financial_assessment, is_loading: false });
            });
        }
    }

    onSubmit = (values, { setSubmitting, setStatus }) => {
        setStatus({ msg: '' });
        this.setState({ is_btn_loading: true });
        WS.setFinancialAssessment(values).then(data => {
            this.setState({ is_btn_loading: false });
            if (data.error) {
                setStatus({ msg: data.error.message });
            } else {
                this.setState({ is_submit_success: true });
                this.props.removeNotificationMessage({ key: 'risk' });
                this.props.removeNotificationByKey({ key: 'risk' });
            }
            setSubmitting(false);
        });
    };

    validateFields = values => {
        this.setState({ is_submit_success: false });
        const errors = {};
        Object.keys(values).forEach(field => {
            if (values[field] !== undefined && !values[field]) {
                errors[field] = localize('This field is required');
            }
        });
        return errors;
    };

    showForm = show_form => this.setState({ show_form });

    toggleConfirmationModal = value => {
        const new_state = { is_confirmation_visible: value };
        if (isMobile()) {
            new_state.show_form = !value;
        }

        this.setState(new_state);
    };

    render() {
        const {
            api_initial_load_error,
            income_source,
            employment_status,
            employment_industry,
            occupation,
            source_of_wealth,
            education_level,
            net_income,
            estimated_worth,
            account_turnover,
            show_form,
            is_loading,
            is_btn_loading,
            is_submit_success,
            is_confirmation_visible,
        } = this.state;

        if (is_loading) return <Loading is_fullscreen={false} className='account___intial-loader' />;
        if (api_initial_load_error) return <LoadErrorMessage error_message={api_initial_load_error} />;
        if (this.props.is_virtual) return <DemoMessage />;
        if (isMobile() && is_submit_success) return <SubmittedPage />;
        if (isMobile()) {
            [
                account_turnover_list,
                education_level_list,
                employment_industry_list,
                employment_status_list,
                estimated_worth_list,
                income_source_list,
                net_income_list,
                occupation_list,
                source_of_wealth_list,
            ].forEach(list => list.forEach(i => (i.nativepicker_text = i.text)));
        }

        return (
            <React.Fragment>
                <Formik
                    initialValues={{
                        income_source,
                        employment_status,
                        employment_industry,
                        occupation,
                        source_of_wealth,
                        education_level,
                        net_income,
                        estimated_worth,
                        account_turnover,
                    }}
                    validate={this.validateFields}
                    onSubmit={this.onSubmit}
                >
                    {({
                        values,
                        errors,
                        status,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        // validateField,
                    }) => (
                        <>
                            {isMobile() && is_confirmation_visible && (
                                <ConfirmationPage toggleModal={this.toggleConfirmationModal} onSubmit={handleSubmit} />
                            )}
                            {isDesktop() && (
                                <ConfirmationModal
                                    is_visible={is_confirmation_visible}
                                    toggleModal={this.toggleConfirmationModal}
                                    onSubmit={handleSubmit}
                                />
                            )}
                            <LeaveConfirm onDirty={this.showForm} />
                            {show_form && (
                                <form className='account-form' onSubmit={handleSubmit}>
                                    <FormBody scroll_offset='80px'>
                                        <FormSubHeader
                                            title={localize('Financial information')}
                                            subtitle={isDesktop() && `(${localize('All fields are required')})`}
                                        />
                                        <fieldset className='account-form__fieldset'>
                                            <Dropdown
                                                placeholder={localize('Source of income')}
                                                is_align_text_left
                                                name='income_source'
                                                list={income_source_list}
                                                value={values.income_source}
                                                onChange={handleChange}
                                                handleBlur={handleBlur}
                                                is_nativepicker={isMobile()}
                                                error={touched.income_source && errors.income_source}
                                            />
                                        </fieldset>
                                        <fieldset className='account-form__fieldset'>
                                            <Dropdown
                                                placeholder={localize('Employment status')}
                                                is_align_text_left
                                                name='employment_status'
                                                list={employment_status_list}
                                                value={values.employment_status}
                                                onChange={handleChange}
                                                handleBlur={handleBlur}
                                                is_nativepicker={isMobile()}
                                                error={touched.employment_status && errors.employment_status}
                                            />
                                        </fieldset>
                                        <fieldset className='account-form__fieldset'>
                                            <Dropdown
                                                placeholder={localize('Industry of employment')}
                                                is_align_text_left
                                                name='employment_industry'
                                                list={employment_industry_list}
                                                value={values.employment_industry}
                                                onChange={handleChange}
                                                handleBlur={handleBlur}
                                                is_nativepicker={isMobile()}
                                                error={touched.employment_industry && errors.employment_industry}
                                            />
                                        </fieldset>
                                        <fieldset className='account-form__fieldset'>
                                            <Dropdown
                                                placeholder={localize('Occupation')}
                                                is_align_text_left
                                                name='occupation'
                                                list={occupation_list}
                                                value={values.occupation}
                                                onChange={handleChange}
                                                handleBlur={handleBlur}
                                                is_nativepicker={isMobile()}
                                                error={touched.occupation && errors.occupation}
                                            />
                                        </fieldset>
                                        <fieldset className='account-form__fieldset'>
                                            <Dropdown
                                                placeholder={localize('Source of wealth')}
                                                is_align_text_left
                                                name='source_of_wealth'
                                                list={source_of_wealth_list}
                                                value={values.source_of_wealth}
                                                onChange={handleChange}
                                                handleBlur={handleBlur}
                                                is_nativepicker={isMobile()}
                                                error={touched.source_of_wealth && errors.source_of_wealth}
                                            />
                                        </fieldset>
                                        <fieldset className='account-form__fieldset'>
                                            <Dropdown
                                                placeholder={localize('Level of education')}
                                                is_align_text_left
                                                name='education_level'
                                                list={education_level_list}
                                                value={values.education_level}
                                                onChange={handleChange}
                                                handleBlur={handleBlur}
                                                is_nativepicker={isMobile()}
                                                error={touched.education_level && errors.education_level}
                                            />
                                        </fieldset>
                                        <fieldset className='account-form__fieldset'>
                                            <Dropdown
                                                placeholder={localize('Net annual income')}
                                                is_align_text_left
                                                name='net_income'
                                                list={net_income_list}
                                                value={values.net_income}
                                                onChange={handleChange}
                                                handleBlur={handleBlur}
                                                is_nativepicker={isMobile()}
                                                error={touched.net_income && errors.net_income}
                                            />
                                        </fieldset>
                                        <fieldset className='account-form__fieldset'>
                                            <Dropdown
                                                placeholder={localize('Estimated net worth')}
                                                is_alignment_top
                                                is_align_text_left
                                                name='estimated_worth'
                                                list={estimated_worth_list}
                                                value={values.estimated_worth}
                                                onChange={handleChange}
                                                handleBlur={handleBlur}
                                                is_nativepicker={isMobile()}
                                                error={touched.estimated_worth && errors.estimated_worth}
                                            />
                                        </fieldset>
                                        <fieldset className='account-form__fieldset'>
                                            <Dropdown
                                                placeholder={localize('Anticipated account turnover')}
                                                is_alignment_top
                                                is_align_text_left
                                                name='account_turnover'
                                                list={account_turnover_list}
                                                value={values.account_turnover}
                                                onChange={handleChange}
                                                handleBlur={handleBlur}
                                                is_nativepicker={isMobile()}
                                                error={touched.account_turnover && errors.account_turnover}
                                            />
                                        </fieldset>
                                    </FormBody>
                                    <FormFooter>
                                        {status && status.msg && <FormSubmitErrorMessage message={status.msg} />}
                                        {isMobile() && (
                                            <span className='account-form__footer-all-fields-required'>
                                                {localize('All fields are required')}
                                            </span>
                                        )}
                                        <Button
                                            type='button'
                                            className='account-form__footer-btn'
                                            onClick={() => this.toggleConfirmationModal(true)}
                                            is_disabled={
                                                isSubmitting ||
                                                !!(
                                                    errors.income_source ||
                                                    !values.income_source ||
                                                    errors.employment_status ||
                                                    !values.employment_status ||
                                                    errors.employment_industry ||
                                                    !values.employment_industry ||
                                                    errors.occupation ||
                                                    !values.occupation ||
                                                    errors.source_of_wealth ||
                                                    !values.source_of_wealth ||
                                                    errors.education_level ||
                                                    !values.education_level ||
                                                    errors.net_income ||
                                                    !values.net_income ||
                                                    errors.estimated_worth ||
                                                    !values.estimated_worth ||
                                                    errors.account_turnover ||
                                                    !values.account_turnover
                                                )
                                            }
                                            has_effect
                                            is_loading={is_btn_loading}
                                            is_submit_success={is_submit_success}
                                            text={localize('Submit')}
                                            primary
                                            large
                                        />
                                    </FormFooter>
                                </form>
                            )}
                        </>
                    )}
                </Formik>
            </React.Fragment>
        );
    }
}

// FinancialAssessment.propTypes = {};
export default connect(({ client, ui }) => ({
    is_virtual: client.is_virtual,
    removeNotificationMessage: ui.removeNotificationMessage,
    removeNotificationByKey: ui.removeNotificationByKey,
}))(FinancialAssessment);
