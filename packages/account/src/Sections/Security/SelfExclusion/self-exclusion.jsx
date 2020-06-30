import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Loading, ThemedScrollbars, DesktopWrapper, MobileWrapper, Input, Button, DatePicker } from '@deriv/components';
import { connect } from 'Stores/connect';
import ObjectUtils from '@deriv/shared/utils/object';
import { toMoment } from '@deriv/shared/utils/date';
import { localize } from '@deriv/translations';
import { WS } from 'Services/ws-methods';
import DemoMessage from 'Components/demo-message';
import Article from './article';
import LoadErrorMessage from 'Components/load-error-message';

class SelfExclusion extends React.Component {
    state = {
        is_loading: true,
        is_success: false,
        error_message: '',
        submit_error_message: '',
        self_exclusions: this.exclusion_data,
    };

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
        max_balance: null,
        max_open_bets: null,
    };

    validateFields = (values) => {
        const errors = {};
        // Regex
        const is_number = /^\d+(\.\d+)?$/;
        const is_integer = /^\d+$/;
        const is_minutes = /^[0-9]|99999/;

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
            if (!is_number.test(values[item])) {
                errors[item] = valid_number_message;
            }
        });

        only_integers.forEach((item) => {
            if (!is_integer.test(values[item])) {
                errors[item] = valid_number_message;
            }
        });

        if (!is_minutes.test(values.session_duration_limit)) {
            errors.session_duration_limit = localize('Reached maximum amount of session duration limit.');
        }

        // TODO: handle timout until and exclude until using date/moment format
        return errors;
    };

    handleSubmit = async (values, { setSubmitting }) => {
        const is_changed = JSON.stringify(this.state.self_exclusions) !== JSON.stringify(values);
        console.log(this.state.self_exclusions);
        console.log(is_changed);
        console.log(values);
        // if (is_changed) {
        //     const request = {
        //         set_self_exclusion: 1,
        //         ...values,
        //     };

        //     const set_self_exclusion_response = await WS.authorized.setSelfExclusion(request);
        //     if (set_self_exclusion_response.error) {
        //         this.setState({ submit_error_message: set_self_exclusion_response.error.message });
        //     } else {
        //         this.setState({
        //             is_success: true,
        //         });
        //         setTimeout(() => {
        //             this.setState({ is_success: false });
        //         }, 500);
        //     }
        // } else {
        //     this.setState({ submit_error_message: localize('You did not change anything.') });
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
            this.setState({
                is_loading: false,
                self_exclusions: this.objectValuesToString(
                    ObjectUtils.getPropertyValue(response, ['get_self_exclusion'])
                ),
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
                <div className='self-exclusion__wrapper'>
                    <ThemedScrollbars autoHide className='self-exclusion__scrollbars' hideHorizontal={true}>
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
                                <Form noValidate>
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
                                                        type='text'
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
                                                        type='text'
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
                                                        type='text'
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
                                                        type='text'
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
                                                        type='text'
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
                                                        type='text'
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
                                                        type='text'
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
                                                        value={values.timeout_until}
                                                        onBlur={() => setTouched({ timeout_until: true })}
                                                        onChange={({ target }) =>
                                                            setFieldValue(
                                                                'timeout_until',
                                                                target?.value
                                                                    ? toMoment(target.value).format('YYYY-MM-DD')
                                                                    : '',
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
                                                    'You will not be able to log in to your account until this date (up to 6 weeks from today).'
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
                                                        type='text'
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
                                                        type='text'
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
                </div>
            </section>
        );
    }
}

export default connect(({ client }) => ({
    is_virtual: client.is_virtual,
    is_switching: client.is_switching,
}))(SelfExclusion);
