import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
    Loading,
    ThemedScrollbars,
    Div100vhContainer,
    DesktopWrapper,
    MobileWrapper,
    Input,
    Button,
    DatePicker,
} from '@deriv/components';
import { connect } from 'Stores/connect';
import ObjectUtils from '@deriv/shared/utils/object';
import { toMoment, epochToMoment } from '@deriv/shared/utils/date';
import { isDesktop, isMobile } from '@deriv/shared/utils/screen';
import { localize } from '@deriv/translations';
import { WS } from 'Services/ws-methods';
import DemoMessage from 'Components/demo-message';
import Article from './article';
import LoadErrorMessage from 'Components/load-error-message';

class SelfExclusion extends React.Component {
    exclusion_data = {
        max_turnover: '',
        max_losses: '',
        max_7day_turnover: '',
        max_7day_losses: '',
        max_30day_turnover: '',
        max_30day_losses: '',
        session_duration_limit: '',
        timeout_until: '',
        exclude_until: '',
        max_balance: '',
        max_open_bets: '',
    };

    state = {
        is_loading: true,
        is_success: false,
        error_message: '',
        submit_error_message: '',
        self_exclusions: this.exclusion_data,
    };

    validateFields = (values) => {
        const errors = {};
        // Regex
        const is_number = /^\d+(\.\d+)?$/;
        const is_integer = /^\d+$/;
        const is_minutes = /^[0-9]|99999/;
        const six_weeks = 60480; // in minutes

        // Messages
        const valid_number_message = localize('Should be a valid number');

        const only_numbers = [
            'max_turnover',
            'max_losses',
            'max_7day_turnover',
            'max_7day_losses',
            'max_30day_turnover',
            'max_30day_losses',
            'max_balance',
        ];
        const only_integers = ['session_duration_limit', 'max_open_bets'];

        only_numbers.forEach((item) => {
            if (values[item]) {
                if (!is_number.test(values[item])) {
                    errors[item] = valid_number_message;
                }
            }
        });

        only_integers.forEach((item) => {
            if (values[item]) {
                if (!is_integer.test(values[item])) {
                    errors[item] = valid_number_message;
                }
            }
        });

        if (values.session_duration_limit) {
            if (!is_minutes.test(values.session_duration_limit)) {
                errors.session_duration_limit = localize('Reached maximum amount of session duration limit.');
            } else if (values.session_duration_limit > six_weeks) {
                errors.session_duration_limit = localize(
                    'Enter a value in minutes, up to 60480 minutes (equivalent to 6 weeks).'
                );
            }
        }

        if (values.timeout_until) {
            if (values.timeout_until <= toMoment().unix()) {
                errors.timeout_until = localize('Timeout time must be greater than current time.');
            } else if (values.timeout_until > toMoment().add(6, 'week').unix()) {
                errors.timeout_until = localize('Timeout time cannot be more than 6 weeks.');
            }
        }

        if (values.exclude_until) {
            if (toMoment(values.exclude_until).unix() < toMoment().unix()) {
                errors.exclude_until = localize('Exclude time must be after today.');
            } else if (toMoment(values.exclude_until).unix() < toMoment().add(6, 'month').unix()) {
                errors.exclude_until = localize('Exclude time cannot be less than 6 months.');
            } else if (toMoment(values.exclude_until).unix() > toMoment().add(5, 'year').unix()) {
                errors.exclude_until = localize('Exclude time cannot be for more than five years.');
            }
        }

        // TODO: handle timout until and exclude until using date/moment format
        return errors;
    };

    handleSubmit = async (values, { setSubmitting }) => {
        console.log(values, 'values');
        console.log(this.state.self_exclusions, 'state');
        // const request = {
        //     set_self_exclusion: 1,
        //     ...values,
        // };

        // const set_self_exclusion_response = await WS.authorized.setSelfExclusion(request);
        // if (set_self_exclusion_response.error) {
        //     this.setState({ submit_error_message: set_self_exclusion_response.error.message });
        // } else {
        //     this.setState({
        //         is_success: true,
        //     });
        //     setTimeout(() => {
        //         this.setState({ is_success: false });
        //     }, 500);
        // }

        setSubmitting(false);
    };

    objectValuesToString = (object) => {
        Object.keys(object).forEach((item) => {
            object[item] = '' + object[item]; // instead of toString, '' + offer more raw speed
        });

        return object;
    };

    populateExclusionResponse = (response) => {
        if (response.error) {
            this.setState({
                is_loading: false,
                error_message: ObjectUtils.getPropertyValue(response, ['error', 'message']),
            });
        } else {
            const response_to_string = this.objectValuesToString(
                ObjectUtils.getPropertyValue(response, ['get_self_exclusion'])
            );
            if (response_to_string.timeout_until) {
                response_to_string.timeout_until = +response_to_string.timeout_until;
            }
            this.setState({
                is_loading: false,
                self_exclusions: { ...this.state.self_exclusions, ...response_to_string },
            });
        }
    };

    getSelfExclusion = async () => {
        this.setState({ is_loading: true });
        const get_self_exclusion_response = await WS.authorized.getSelfExclusion({ get_self_exclusion: 1 });
        this.populateExclusionResponse(get_self_exclusion_response);
    };

    componentDidMount() {
        const { is_virtual } = this.props;
        if (is_virtual) {
            this.setState({ is_loading: false });
        } else {
            this.getSelfExclusion();
        }
    }

    render() {
        const { error_message, is_loading } = this.state;
        const { is_virtual, is_switching } = this.props;

        if (is_virtual) return <DemoMessage />;

        if (is_loading || is_switching) return <Loading is_fullscreen={false} className='account___intial-loader' />;

        if (error_message) return <LoadErrorMessage error_message={error_message} />;

        return (
            <section className='self-exclusion'>
                <Div100vhContainer className='self-exclusion__wrapper' is_disabled={isDesktop()} height_offset='80px'>
                    <ThemedScrollbars className='self-exclusion__scrollbars' is_bypassed={isMobile()}>
                        <MobileWrapper>
                            <Article />
                        </MobileWrapper>

                        <Formik
                            initialValues={this.state.self_exclusions}
                            onSubmit={this.handleSubmit}
                            validate={this.validateFields}
                        >
                            {({
                                values,
                                errors,
                                isValid,
                                dirty,
                                touched,
                                handleChange,
                                handleBlur,
                                isSubmitting,
                                setTouched,
                                setFieldValue,
                            }) => (
                                <Form className='self-exclusion__form' noValidate>
                                    <h2 className='self-exclusion__header'>{localize('Your stake and loss limits')}</h2>
                                    <div className='self-exclusion__item-wrapper'>
                                        <div className='self-exclusion__item'>
                                            <h3 className='self-exclusion__item-title'>{localize('Daily')}</h3>
                                            <p className='self-exclusion__item-field'>{localize('Max. total stake')}</p>
                                            <Field name='max_turnover'>
                                                {({ field }) => (
                                                    <Input
                                                        {...field}
                                                        data-lpignore='true'
                                                        className='self-exclusion__input'
                                                        label={localize('USD')}
                                                        value={values.max_turnover}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                        error={touched.max_turnover && errors.max_turnover}
                                                    />
                                                )}
                                            </Field>
                                            <p className='self-exclusion__item-field'>{localize('Max. total loss')}</p>
                                            <Field name='max_losses'>
                                                {({ field }) => (
                                                    <Input
                                                        {...field}
                                                        data-lpignore='true'
                                                        className='self-exclusion__input'
                                                        label={localize('USD')}
                                                        value={values.max_losses}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                        error={touched.max_losses && errors.max_losses}
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                        <div className='self-exclusion__item'>
                                            <h3 className='self-exclusion__item-title'>{localize('7 days')}</h3>
                                            <p className='self-exclusion__item-field'>{localize('Max. total stake')}</p>
                                            <Field name='max_7day_turnover'>
                                                {({ field }) => (
                                                    <Input
                                                        {...field}
                                                        data-lpignore='true'
                                                        className='self-exclusion__input'
                                                        label={localize('USD')}
                                                        value={values.max_7day_turnover}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                        error={touched.max_7day_turnover && errors.max_7day_turnover}
                                                    />
                                                )}
                                            </Field>
                                            <p className='self-exclusion__item-field'>{localize('Max. total loss')}</p>
                                            <Field name='max_7day_losses'>
                                                {({ field }) => (
                                                    <Input
                                                        {...field}
                                                        data-lpignore='true'
                                                        className='self-exclusion__input'
                                                        label={localize('USD')}
                                                        value={values.max_7day_losses}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                        error={touched.max_7day_losses && errors.max_7day_losses}
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                        <div className='self-exclusion__item'>
                                            <h3 className='self-exclusion__item-title'>{localize('30 days')}</h3>
                                            <p className='self-exclusion__item-field'>{localize('Max. total stake')}</p>
                                            <Field name='max_30day_turnover'>
                                                {({ field }) => (
                                                    <Input
                                                        {...field}
                                                        data-lpignore='true'
                                                        className='self-exclusion__input'
                                                        label={localize('USD')}
                                                        value={values.max_30day_turnover}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                        error={touched.max_30day_turnover && errors.max_7day_turnover}
                                                    />
                                                )}
                                            </Field>
                                            <p className='self-exclusion__item-field'>{localize('Max. total loss')}</p>
                                            <Field name='max_30day_losses'>
                                                {({ field }) => (
                                                    <Input
                                                        {...field}
                                                        data-lpignore='true'
                                                        className='self-exclusion__input'
                                                        label={localize('USD')}
                                                        value={values.max_30day_losses}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                        error={touched.max_30day_losses && errors.max_30day_losses}
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                    </div>
                                    <h2 className='self-exclusion__header'>
                                        {localize('Your session and login limits')}
                                    </h2>
                                    <div className='self-exclusion__item-wrapper'>
                                        <div className='self-exclusion__item'>
                                            <p className='self-exclusion__item-field'>
                                                {localize(
                                                    'You will be automatically logged out from each session after this time limit.'
                                                )}
                                            </p>
                                            <Field name='session_duration_limit'>
                                                {({ field }) => (
                                                    <Input
                                                        {...field}
                                                        data-lpignore='true'
                                                        className='self-exclusion__input'
                                                        label={localize('Minutes')}
                                                        value={values.session_duration_limit}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                        error={
                                                            touched.session_duration_limit &&
                                                            errors.session_duration_limit
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                        <div className='self-exclusion__item'>
                                            <p className='self-exclusion__item-field'>
                                                {localize(
                                                    'You will not be able to log in to your account until this date (up to 6 weeks from today).'
                                                )}
                                            </p>
                                            <Field name='timeout_until'>
                                                {({ field }) => (
                                                    <DatePicker
                                                        {...field}
                                                        className='self-exclusion__input'
                                                        label={localize('Date')}
                                                        value={
                                                            values.timeout_until && epochToMoment(values.timeout_until)
                                                        }
                                                        onBlur={() => setTouched({ timeout_until: true })}
                                                        onChange={({ target }) =>
                                                            setFieldValue(
                                                                'timeout_until',
                                                                target?.value ? target.value.unix() : '',
                                                                true
                                                            )
                                                        }
                                                        required
                                                        readOnly
                                                        error={touched.timeout_until && errors.timeout_until}
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                        <div className='self-exclusion__item'>
                                            <p className='self-exclusion__item-field'>
                                                {localize(
                                                    'Your account will be excluded from the website until this date (at least 6 months, up to 5 years).'
                                                )}
                                            </p>
                                            <Field name='exclude_until'>
                                                {({ field }) => (
                                                    <DatePicker
                                                        {...field}
                                                        alignment='left'
                                                        className='self-exclusion__input'
                                                        label={localize('Date')}
                                                        value={values.exclude_until}
                                                        onBlur={() => setTouched({ exclude_until: true })}
                                                        onChange={({ target }) =>
                                                            setFieldValue(
                                                                'exclude_until',
                                                                target?.value
                                                                    ? toMoment(target.value).format('YYYY-MM-DD')
                                                                    : '',
                                                                true
                                                            )
                                                        }
                                                        required
                                                        autoComplete='off'
                                                        readOnly
                                                        error={touched.exclude_until && errors.exclude_until}
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                    </div>
                                    <h2 className='self-exclusion__header'>
                                        {localize('Your maximum account balance and open positions')}
                                    </h2>
                                    <div className='self-exclusion__item-wrapper'>
                                        <div className='self-exclusion__item'>
                                            <p className='self-exclusion__item-field'>
                                                {localize(
                                                    'Once your account balance reaches this amount, you will not be able to deposit funds into your account.'
                                                )}
                                            </p>
                                            <Field name='max_balance'>
                                                {({ field }) => (
                                                    <Input
                                                        {...field}
                                                        data-lpignore='true'
                                                        className='self-exclusion__input'
                                                        label={localize('USD')}
                                                        value={values.max_balance}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                        error={touched.max_balance && errors.max_balance}
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                        <div className='self-exclusion__item'>
                                            <p className='self-exclusion__item-field'>
                                                {localize('You can only open positions up to this amount.')}
                                            </p>
                                            <Field name='max_open_bets'>
                                                {({ field }) => (
                                                    <Input
                                                        {...field}
                                                        data-lpignore='true'
                                                        className='self-exclusion__input'
                                                        label={localize('Amount')}
                                                        value={values.max_open_bets}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                        error={touched.max_open_bets && errors.max_open_bets}
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                    </div>
                                    <div className='self-exclusion__button-wrapper'>
                                        <Button
                                            disabled={!dirty || !isValid || isSubmitting}
                                            primary
                                            className='self-exclusion__button'
                                            large
                                            type='submit'
                                        >
                                            {localize('Save')}
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </ThemedScrollbars>
                    <DesktopWrapper>
                        <Article />
                    </DesktopWrapper>
                </Div100vhContainer>
            </section>
        );
    }
}

export default connect(({ client }) => ({
    is_virtual: client.is_virtual,
    is_switching: client.is_switching,
}))(SelfExclusion);
