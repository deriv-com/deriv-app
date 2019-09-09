// import PropTypes        from 'prop-types';
import React        from 'react';
import { Formik }   from 'formik';
import {
    Button,
    Dropdown }      from 'deriv-components';
import { localize } from 'App/i18n';
import { WS }       from 'Services';
import {
    income_source_list,
    employment_status_list,
    employment_industry_list,
    occupation_list,
    source_of_wealth_list,
    education_level_list,
    net_income_list,
    estimated_worth_list,
    account_turnover_list } from './constants-financial-information';
import {
    FormBody,
    FormFooter } from '../Components/layout-components.jsx';
import Loading   from '../../../../templates/app/components/loading.jsx';

const validateFields = values => {
    const errors = {};
    const required_fields = ['income_source', 'employment_status', 'employment_industry', 'occupation', 'source_of_wealth', 'education_level', 'net_income', 'estimated_worth', 'account_turnover'];
    required_fields.forEach(required => {
        if (!values[required]) errors[required] = 'This field is required';
    });
    return errors;
};

class FinancialAssessment extends React.Component {
    state = { is_loading: true };

    onSubmit = values => {
        console.log('on_submit: ', values);
        WS.setFinancialAssessment(values);
    }

    render() {
        console.log(this.state);
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

        if (is_loading) return <Loading />;
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
                    <form className='account-management-form' onSubmit={handleSubmit}>
                        <h1>{localize('Financial information')}</h1>
                        <FormBody scroll_offset='120px'>
                            <fieldset className='account-management-form-fieldset'>
                                <Dropdown
                                    placeholder={localize('source of income')}
                                    is_align_text_left
                                    name='income_source'
                                    list={income_source_list}
                                    value={values.income_source}
                                    onChange={handleChange}
                                />
                                {errors.income_source && touched.income_source && errors.income_source}
                            </fieldset>
                            <fieldset className='account-management-form-fieldset'>
                                <Dropdown
                                    placeholder={localize('employment status')}
                                    is_align_text_left
                                    name='employment_status'
                                    list={employment_status_list}
                                    value={values.employment_status}
                                    onChange={handleChange}
                                />
                                {errors.employment_status && touched.employment_status && errors.employment_status}
                            </fieldset>
                            <fieldset className='account-management-form-fieldset'>
                                <Dropdown
                                    placeholder={localize('industry of employment')}
                                    is_align_text_left
                                    name='employment_industry'
                                    list={employment_industry_list}
                                    value={values.employment_industry}
                                    onChange={handleChange}
                                />
                                {errors.employment_industry && touched.employment_industry
                                    && errors.employment_industry}
                            </fieldset>
                            <fieldset className='account-management-form-fieldset'>
                                <Dropdown
                                    placeholder={localize('occupation')}
                                    is_align_text_left
                                    name='occupation'
                                    list={occupation_list}
                                    value={values.occupation}
                                    onChange={handleChange}
                                />
                                {errors.occupation && touched.occupation && errors.occupation}
                            </fieldset>
                            <fieldset className='account-management-form-fieldset'>
                                <Dropdown
                                    placeholder={localize('source of wealth')}
                                    is_align_text_left
                                    name='source_of_wealth'
                                    list={source_of_wealth_list}
                                    value={values.source_of_wealth}
                                    onChange={handleChange}
                                />
                                {errors.source_of_wealth && touched.source_of_wealth && errors.source_of_wealth}
                            </fieldset>
                            <fieldset className='account-management-form-fieldset'>
                                <Dropdown
                                    placeholder={localize('level of education')}
                                    is_align_text_left
                                    name='education_level'
                                    list={education_level_list}
                                    value={values.education_level}
                                    onChange={handleChange}
                                />
                                {errors.education_level && touched.education_level && errors.education_level}
                            </fieldset>
                            <fieldset className='account-management-form-fieldset'>
                                <Dropdown
                                    placeholder={localize('net annual income')}
                                    is_align_text_left
                                    name='net_income'
                                    list={net_income_list}
                                    value={values.net_income}
                                    onChange={handleChange}
                                />
                                {errors.net_income && touched.net_income && errors.net_income}
                            </fieldset>
                            <fieldset className='account-management-form-fieldset'>
                                <Dropdown
                                    placeholder={localize('estimated net worth')}
                                    is_align_text_left
                                    name='estimated_worth'
                                    list={estimated_worth_list}
                                    value={values.estimated_worth}
                                    onChange={handleChange}
                                />
                                {errors.estimated_worth && touched.estimated_worth && errors.estimated_worth}
                            </fieldset>
                            <fieldset className='account-management-form-fieldset'>
                                <Dropdown
                                    placeholder={localize('anticipated account turnover')}
                                    is_align_text_left
                                    name='account_turnover'
                                    list={account_turnover_list}
                                    value={values.account_turnover}
                                    onChange={handleChange}
                                />
                                {errors.account_turnover && touched.account_turnover && errors.account_turnover}
                            </fieldset>
                        </FormBody>
                        <FormFooter>
                            <Button type='submit' disabled={isSubmitting}>
                              Submit
                            </Button>
                        </FormFooter>
                    </form>
                )}
            </Formik>
        );
    }

    componentDidMount() {
        WS.getFinancialAssessment().then((data) => {
            console.log(data);
            this.setState({ ...data.get_financial_assessment, is_loading: false });
        });
    }
}

// FinancialAssessment.propTypes = {};

export default FinancialAssessment;
