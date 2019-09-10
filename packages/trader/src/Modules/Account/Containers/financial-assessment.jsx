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
    account_turnover_list } from '../Constants/constants-financial-information';
import {
    FormBody,
    FormFooter } from '../Components/layout-components.jsx';
import Loading   from '../../../templates/app/components/loading.jsx';

const validateFields = values => {
    const errors = {};
    const required_fields = ['income_source', 'employment_status', 'employment_industry', 'occupation', 'source_of_wealth', 'education_level', 'net_income', 'estimated_worth', 'account_turnover'];
    required_fields.forEach(required => {
        if (!values[required]) errors[required] = localize('This field is required');
    });
    return errors;
};

class FinancialAssessment extends React.Component {
    state = { is_loading: true };

    componentDidMount() {
        WS.getFinancialAssessment().then((data) => {
            console.log(data);
            this.setState({ ...data.get_financial_assessment, is_loading: false });
        });
    }

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
                    <form className='account-management-form' onSubmit={handleSubmit} style={{ height: 'calc(100vh - 160px)' }}>
                        <div className='account-management-form-header'>
                            <h1 className='account-management-form-header-text'>
                                {localize('Financial information')}
                                <i className='account-management-form-header-subheader'>
                                    ({localize('All fields are required')})
                                </i>
                            </h1>x
                        </div>
                        {is_loading ?
                            <FormBody>
                                <Loading is_fullscreen={false} className='initial-loader--accounts-modal' />
                            </FormBody>
                            :
                            <FormBody scroll_offset='90px'>
                                <fieldset className='account-management-form-fieldset'>
                                    <Dropdown
                                        placeholder={localize('source of income')}
                                        is_align_text_left
                                        name='income_source'
                                        list={income_source_list}
                                        value={values.income_source}
                                        onChange={handleChange}
                                    />
                                    {(errors.income_source || (touched.income_source && errors.income_source)) &&
                                    <span className='fa-dropdown__error-message'>
                                        {errors.income_source}
                                    </span>
                                    }
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
                                    {(errors.employment_status ||
                                        (touched.employment_status && errors.employment_status)) &&
                                        <span className='fa-dropdown__error-message'>
                                            {errors.employment_status}
                                        </span>
                                    }
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
                                    {(errors.employment_industry ||
                                        (touched.employment_industry && errors.employment_industry)) &&
                                        <span className='fa-dropdown__error-message'>
                                            {errors.employment_industry}
                                        </span>
                                    }
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
                                    {(errors.occupation || (errors.occupation && touched.occupation)) &&
                                    <span className='fa-dropdown__error-message'>
                                        {errors.occupation}
                                    </span>
                                    }
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
                                    {(errors.source_of_wealth ||
                                        (touched.source_of_wealth && errors.source_of_wealth)) &&
                                        <span className='fa-dropdown__error-message'>
                                            {errors.source_of_wealth}
                                        </span>
                                    }
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
                                    {(errors.education_level || (touched.education_level && errors.education_level)) &&
                                    <span className='fa-dropdown__error-message'>
                                        {errors.education_level}
                                    </span>
                                    }
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
                                    {(errors.net_income || (touched.net_income && errors.net_income)) &&
                                    <span className='fa-dropdown__error-message'>
                                        {errors.net_income}
                                    </span>
                                    }
                                </fieldset>
                                <fieldset className='account-management-form-fieldset'>
                                    <Dropdown
                                        placeholder={localize('estimated net worth')}
                                        is_alignment_top
                                        is_align_text_left
                                        name='estimated_worth'
                                        list={estimated_worth_list}
                                        value={values.estimated_worth}
                                        onChange={handleChange}
                                    />
                                    {(errors.estimated_worth || (errors.estimated_worth && touched.estimated_worth)) &&
                                    <span className='fa-dropdown__error-message'>
                                        {errors.estimated_worth}
                                    </span>
                                    }
                                </fieldset>
                                <fieldset className='account-management-form-fieldset'>
                                    <Dropdown
                                        placeholder={localize('anticipated account turnover')}
                                        is_alignment_top
                                        is_align_text_left
                                        name='account_turnover'
                                        list={account_turnover_list}
                                        value={values.account_turnover}
                                        onChange={handleChange}
                                    />
                                    {(errors.account_turnover ||
                                        (errors.account_turnover && touched.account_turnover)) &&
                                        <span className='fa-dropdown__error-message'>
                                            {errors.account_turnover}
                                        </span>
                                    }
                                </fieldset>
                            </FormBody>
                        }
                        <FormFooter>
                            <Button type='submit' disabled={isSubmitting || this.state.is_loading}>
                              Submit
                            </Button>
                        </FormFooter>
                    </form>
                )}
            </Formik>
        );
    }
}

// FinancialAssessment.propTypes = {};

export default FinancialAssessment;
