// import PropTypes        from 'prop-types';
import React        from 'react';
import { Formik }   from 'formik';
import {
    Button,
    Dropdown }      from 'deriv-components';
import { connect }  from 'Stores/connect';
import { localize } from 'App/i18n';
import { WS }       from 'Services';
import DemoMessage  from '../../ErrorMessages/DemoMessage';
import {
    income_source_list,
    employment_status_list,
    employment_industry_list,
    occupation_list,
    source_of_wealth_list,
    education_level_list,
    net_income_list,
    estimated_worth_list,
    account_turnover_list } from '../../../Constants/constants-financial-information';
import {
    FormBody,
    FormSubHeader,
    FormFooter } from '../../../Components/layout-components.jsx';
import Loading   from '../../../../../templates/app/components/loading.jsx';

const validateFields = values => {
    const errors = {};
    Object.keys(values).forEach(field => {
        if (values[field] !== undefined && !values[field]) {
            errors[field] = localize('This field is required');
        }
    });
    return errors;
};

class FinancialAssessment extends React.Component {
    state = { is_loading: true };

    componentDidMount() {
        if (this.props.is_virtual) {
            this.setState({ is_loading: false });
        } else {
            WS.getFinancialAssessment().then((data) => {
                console.log(data);
                this.setState({ ...data.get_financial_assessment, is_loading: false });
            });
        }
    }

    onSubmit = values => {
        console.log('on_submit: ', values);
        WS.setFinancialAssessment(values);
    }

    render() {
        const {
            // financial information
            income_source,
            employment_status,
            employment_industry,
            occupation,
            source_of_wealth,
            education_level,
            net_income,
            estimated_worth,
            account_turnover,
            is_loading } = this.state;

        if (this.props.is_virtual) return <DemoMessage />;
        return (
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
                validate={validateFields}
                onSubmit={this.onSubmit}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    // handleBlur,
                    handleSubmit,
                    isSubmitting,
                    // validateField,
                }) => (
                    <form className='account-management-form' onSubmit={handleSubmit} style={{ height: 'calc(100vh - 120px)' }}>
                        {is_loading ?
                            <FormBody>
                                <Loading is_fullscreen={false} className='initial-loader--accounts-modal' />
                            </FormBody>
                            :
                            <FormBody scroll_offset='55px'>
                                <FormSubHeader title={localize('Financial information')} subtitle={`(${localize('All fields are required')})`} />
                                <fieldset className='account-management-form-fieldset'>
                                    <Dropdown
                                        placeholder={localize('Source of income')}
                                        is_align_text_left
                                        name='income_source'
                                        list={income_source_list}
                                        value={values.income_source}
                                        onChange={handleChange}
                                        error={(errors.income_source || (touched.income_source && errors.income_source))}
                                    />
                                </fieldset>
                                <fieldset className='account-management-form-fieldset'>
                                    <Dropdown
                                        placeholder={localize('Employment status')}
                                        is_align_text_left
                                        name='employment_status'
                                        list={employment_status_list}
                                        value={values.employment_status}
                                        onChange={handleChange}
                                        error={(errors.employment_status || (touched.employment_status && errors.employment_status))}
                                    />
                                </fieldset>
                                <fieldset className='account-management-form-fieldset'>
                                    <Dropdown
                                        placeholder={localize('Industry of employment')}
                                        is_align_text_left
                                        name='employment_industry'
                                        list={employment_industry_list}
                                        value={values.employment_industry}
                                        onChange={handleChange}
                                        error={(errors.employment_industry || (touched.employment_industry && errors.employment_industry))}
                                    />
                                </fieldset>
                                <fieldset className='account-management-form-fieldset'>
                                    <Dropdown
                                        placeholder={localize('Occupation')}
                                        is_align_text_left
                                        name='occupation'
                                        list={occupation_list}
                                        value={values.occupation}
                                        onChange={handleChange}
                                        error={(errors.occupation || (touched.occupation && errors.occupation))}
                                    />
                                </fieldset>
                                <fieldset className='account-management-form-fieldset'>
                                    <Dropdown
                                        placeholder={localize('Source of wealth')}
                                        is_align_text_left
                                        name='source_of_wealth'
                                        list={source_of_wealth_list}
                                        value={values.source_of_wealth}
                                        onChange={handleChange}
                                        error={(errors.source_of_wealth || (touched.source_of_wealth && errors.source_of_wealth))}
                                    />
                                </fieldset>
                                <fieldset className='account-management-form-fieldset'>
                                    <Dropdown
                                        placeholder={localize('Level of education')}
                                        is_align_text_left
                                        name='education_level'
                                        list={education_level_list}
                                        value={values.education_level}
                                        onChange={handleChange}
                                        error={(errors.education_level || (touched.education_level && errors.education_level))}
                                    />
                                </fieldset>
                                <fieldset className='account-management-form-fieldset'>
                                    <Dropdown
                                        placeholder={localize('Net annual income')}
                                        is_align_text_left
                                        name='net_income'
                                        list={net_income_list}
                                        value={values.net_income}
                                        onChange={handleChange}
                                        error={(errors.net_income || (touched.net_income && errors.net_income))}
                                    />
                                </fieldset>
                                <fieldset className='account-management-form-fieldset'>
                                    <Dropdown
                                        placeholder={localize('Estimated net worth')}
                                        is_alignment_top
                                        is_align_text_left
                                        name='estimated_worth'
                                        list={estimated_worth_list}
                                        value={values.estimated_worth}
                                        onChange={handleChange}
                                        error={(errors.estimated_worth || (touched.estimated_worth && errors.estimated_worth))}
                                    />
                                </fieldset>
                                <fieldset className='account-management-form-fieldset'>
                                    <Dropdown
                                        placeholder={localize('Anticipated account turnover')}
                                        is_alignment_top
                                        is_align_text_left
                                        name='account_turnover'
                                        list={account_turnover_list}
                                        value={values.account_turnover}
                                        onChange={handleChange}
                                        error={(errors.account_turnover || (touched.account_turnover && errors.account_turnover))}
                                    />
                                </fieldset>
                            </FormBody>
                        }
                        <FormFooter>
                            <Button
                                className='btn--primary'
                                type='submit'
                                disabled={isSubmitting}
                                has_effect
                                text={localize('Submit')}
                            />
                        </FormFooter>
                    </form>
                )}
            </Formik>
        );
    }
}

// FinancialAssessment.propTypes = {};
// PersonalDetailsForm.propTypes = {};
export default connect(
    ({ client }) => ({
        is_virtual: client.is_virtual,
    }),
)(FinancialAssessment);
