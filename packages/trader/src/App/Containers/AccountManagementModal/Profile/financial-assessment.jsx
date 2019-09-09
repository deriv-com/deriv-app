// import PropTypes        from 'prop-types';
import React      from 'react';
import { WS }     from 'Services';
import { Formik } from 'formik';
import {
    Button,
    Dropdown }    from 'deriv-components';
import { 
    income_source_list,
    employment_status_list, 
    employment_industry_list,
    occupation_list,
    source_of_wealth_list,
    education_level_list,
    net_income_list, 
    estimated_worth_list,
    account_turnover_list,
} from './constants-financial-information';
import {
    trading_experience_list,
    trading_frequency_list,
} from './constants-trading-experience'
import {
    FormBody,
    FormFooter } from '../Components/layout-components.jsx';
import Loading   from '../../../../templates/app/components/loading.jsx';


const validateFields = values => {
        let errors = {};
        const required_fields = ['income_source', 'employment_status', 'employment_industry', 'occupation', 'source_of_wealth', 'education_level', 'net_income', 'estimated_worth', 'account_turnover']
        required_fields.forEach(required => {
            if (!values[required]) errors[required] = 'This field is required'
        })
        return errors;
};

class FinancialAssessment extends React.Component {
    state = { is_loading: true };

    onSubmit = values => {
        console.log('on_submit: ', values);
        WS.setFinancialAssessment(values)
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

        // TODO: add MT5 financial check
        const has_trading_experience = true;

        if (is_loading) return <Loading />

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
                    account_turnover 
                }}
                validate={validateFields}
                onSubmit={this.onSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              validateField,
            }) => (
              <form className='account-management-form' onSubmit={handleSubmit}>
                  <FormBody>
                    <h1>Financial information</h1>
                    <Dropdown name="income_source" list={income_source_list} value={values.income_source} onChange={handleChange} />
                    {errors.income_source && touched.income_source && errors.income_source}
                    <Dropdown name="employment_status" list={employment_status_list} value={values.employment_status} onChange={handleChange} />
                    {errors.employment_status && touched.employment_status && errors.employment_status}
                    <Dropdown name="employment_industry" list={employment_industry_list} value={values.employment_industry} onChange={handleChange} />
                    {errors.employment_industry && touched.employment_industry && errors.employment_industry}
                    <Dropdown name="occupation" list={occupation_list} value={values.occupation} onChange={handleChange} />
                    {errors.occupation && touched.occupation && errors.occupation}
                    <Dropdown name="source_of_wealth" list={source_of_wealth_list} value={values.source_of_wealth} onChange={handleChange} />
                    {errors.source_of_wealth && touched.source_of_wealth && errors.source_of_wealth}
                    <Dropdown name="education_level" list={education_level_list} value={values.education_level} onChange={handleChange} />
                    {errors.education_level && touched.education_level && errors.education_level}
                    <Dropdown name="net_income" list={net_income_list} value={values.net_income} onChange={handleChange} />
                    {errors.net_income && touched.net_income && errors.net_income}
                    <Dropdown name="estimated_worth" list={estimated_worth_list} value={values.estimated_worth} onChange={handleChange} />
                    {errors.estimated_worth && touched.estimated_worth && errors.estimated_worth}
                    <Dropdown name="account_turnover" list={account_turnover_list} value={values.account_turnover} onChange={handleChange} />
                    {errors.account_turnover && touched.account_turnover && errors.account_turnover}
                    {
                        has_trading_experience && (
                            <>
                                <h1>Trading experience</h1>
                                <Dropdown name="forex_trading_experience" list={trading_experience_list} value={values.forex_trading_experience} onChange={handleChange} />
                                {errors.account_turnover && touched.account_turnover && errors.account_turnover}
                                <Dropdown name="forex_trading_frequency" list={trading_frequency_list} value={values.forex_trading_frequency} onChange={handleChange} />
                                {errors.account_turnover && touched.account_turnover && errors.account_turnover}
                                <Dropdown name="binary_options_trading_experience" list={trading_experience_list} value={values.binary_options_trading_experience} onChange={handleChange} />
                                {errors.account_turnover && touched.account_turnover && errors.account_turnover}
                                <Dropdown name="binary_options_trading_frequency" list={trading_frequency_list} value={values.binary_options_trading_frequency} onChange={handleChange} />
                                {errors.account_turnover && touched.account_turnover && errors.account_turnover}
                                <Dropdown name="cfd_trading_experience" list={trading_experience_list} value={values.cfd_trading_experience} onChange={handleChange} />
                                {errors.account_turnover && touched.account_turnover && errors.account_turnover}
                                <Dropdown name="cfd_trading_frequency" list={trading_frequency_list} value={values.cfd_trading_frequency} onChange={handleChange} />
                                {errors.account_turnover && touched.account_turnover && errors.account_turnover}
                                <Dropdown name="other_instruments_trading_experience" list={trading_experience_list} value={values.other_instruments_trading_experience} onChange={handleChange} />
                                {errors.account_turnover && touched.account_turnover && errors.account_turnover}
                                <Dropdown name="other_instruments_trading_frequency" list={trading_frequency_list} value={values.other_instruments_trading_frequency} onChange={handleChange} />
                                {errors.account_turnover && touched.account_turnover && errors.account_turnover}
                            </>
                        )
                    }
                </FormBody>
                <FormFooter>
                    <Button type="submit" disabled={isSubmitting}>
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
        })
    }
}

// FinancialAssessment.propTypes = {};

export default FinancialAssessment
