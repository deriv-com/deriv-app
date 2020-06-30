import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
    Loading,
    ThemedScrollbars,
    Div100vhContainer,
    DesktopWrapper,
    MobileWrapper,
    Modal,
    Input,
    Icon,
    Button,
    DatePicker,
} from '@deriv/components';
import { connect } from 'Stores/connect';
import ObjectUtils from '@deriv/shared/utils/object';
import { toMoment, epochToMoment } from '@deriv/shared/utils/date';
import { isDesktop, isMobile } from '@deriv/shared/utils/screen';
import { getDerivComLink } from '@deriv/shared/utils/url';
import { localize, Localize } from '@deriv/translations';
import { WS } from 'Services/ws-methods';
import DemoMessage from 'Components/demo-message';
import Article from './article';
import LoadErrorMessage from 'Components/load-error-message';
import { setTime } from '@deriv/shared/src/utils/date/date-time';

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

    exclusion_texts = {
        max_turnover: localize('Max. total stake per day'),
        max_losses: localize('Max. total loss per day'),
        max_7day_turnover: localize('Max. total stake over 7 days'),
        max_7day_losses: localize('Max. total loss over 7 days'),
        max_30day_turnover: localize('Max. total stake over 30 days'),
        max_30day_losses: localize('Max. total loss over 30 days'),
        session_duration_limit: localize('Time limit per session'),
        timeout_until: localize('Time out until'),
        exclude_until: localize('Excluded from Deriv.com until'),
        max_balance: localize('Max. account balance'),
        max_open_bets: localize('Max. open positions'),
    };

    state = {
        is_loading: true,
        is_success: false,
        is_confirm_page: false,
        changed_attributes: [],
        error_message: '',
        self_exclusions: this.exclusion_data,
        show_confirm: false,
        submit_error_message: '',
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
        const need_logout_exclusions = ['exclude_until', 'timeout_until'];
        const has_need_logout = this.state.changed_attributes.some((attr) => need_logout_exclusions.includes(attr));

        const makeRequest = () =>
            new Promise(async (resolve) => {
                const request = {
                    set_self_exclusion: 1,
                };

                this.state.changed_attributes.forEach((attr) => {
                    request[attr] = values[attr];
                });

                const set_self_exclusion_response = await WS.authorized.setSelfExclusion(request);
                resolve(set_self_exclusion_response);
            });

        if (has_need_logout) {
            if (this.state.show_confirm) {
                const response = await makeRequest();
                if (response.error) {
                    this.setState({
                        submit_error_message: `${this.exclusion_texts[response.error.field]}: ${
                            response.error.message
                        }`,
                    });
                    this.setState({ show_confirm: false });
                } else {
                    this.props.logout();
                }
            } else {
                this.setState({ show_confirm: true });
            }
        } else {
            const response = await makeRequest();
            if (response.error) {
                this.setState({
                    submit_error_message: `${this.exclusion_texts[response.error.field]}: ${response.error.message}`,
                });
            } else {
                setSubmitting(false);
                this.setState({ show_confirm: false, is_loading: true, is_confirm_page: false });
                this.getSelfExclusion();
            }
        }
    };

    goToConfirm = (values) => {
        const changed_attributes = Object.keys(values).filter((key) => values[key] !== this.state.self_exclusions[key]);
        this.setState({ changed_attributes, is_confirm_page: true });
    };

    backToReview = () => {
        this.setState({ show_confirm: false });
    };

    objectValuesToString = (object) => {
        Object.keys(object).forEach((item) => {
            object[item] = '' + object[item]; // instead of toString, '' + offer more raw speed
        });

        return object;
    };

    componentWillUnmount() {
        this.setState({ changed_attributes: [] });
    }

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
        const {
            error_message,
            is_loading,
            is_confirm_page,
            changed_attributes,
            show_confirm,
            submit_error_message,
        } = this.state;
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
                                handleSubmit,
                                setFieldValue,
                            }) => (
                                <Form className='self-exclusion__form' noValidate>
                                    {is_confirm_page ? (
                                        <>
                                            <Modal
                                                className='self_exclusion__modal'
                                                is_open={show_confirm}
                                                has_close_icon={false}
                                            >
                                                <div className='self-exclusion__popup'>
                                                    <Icon icon='IcStop' className='self-exclusion__popup-image' />
                                                    <h4 className='self-exclusion__popup-header'>
                                                        {localize('Save new limits?')}
                                                    </h4>
                                                    {/* TODO: will include this text once the requirement confirmed */}
                                                    <p className='self-exclusion__popup-desc'>
                                                        {localize(
                                                            'Remember: You cannot log in to your account until the selected date.'
                                                        )}
                                                    </p>
                                                    <div className='self-exclusion__popup-buttons'>
                                                        <Button
                                                            type='button'
                                                            secondary
                                                            large
                                                            onClick={this.backToReview}
                                                        >
                                                            {localize('No, review my limits')}
                                                        </Button>
                                                        <Button
                                                            type='submit'
                                                            is_loading={isSubmitting}
                                                            is_disabled={isSubmitting}
                                                            primary
                                                            large
                                                            text={localize('Yes, log me out immediately')}
                                                            onClick={handleSubmit}
                                                        />
                                                    </div>
                                                </div>
                                            </Modal>
                                            <div
                                                onClick={() => {
                                                    this.setState({ is_confirm_page: false });
                                                }}
                                                className='self-exclusion__back'
                                            >
                                                <Icon icon='IcArrowLeftBold' />
                                                <p>{localize('Back')}</p>
                                            </div>
                                            <div className='self-exclusion__confirm'>
                                                <h2 className='self-exclusion__confirm-header'>
                                                    {localize('You have set the following limits:')}
                                                </h2>
                                                {changed_attributes.map((key, idx) => {
                                                    const need_date_format = ['exclude_until', 'timeout_until'];
                                                    return (
                                                        <div key={idx} className='self-exclusion__confirm-item'>
                                                            <p className='self-exclusion__confirm-label'>
                                                                {this.exclusion_texts[key]}
                                                            </p>
                                                            <p className='self-exclusion__confirm-value'>
                                                                {need_date_format.includes(key)
                                                                    ? toMoment(values[key]).format('DD MMM YYYY')
                                                                    : values[key]}
                                                            </p>
                                                        </div>
                                                    );
                                                })}
                                                <p className='self-exclusion__confirm-note'>
                                                    <Localize
                                                        i18n_default_text='You’ll be able to adjust these limits at any time. You can reduce your limits from the <0>self-exclusion page</0>. To increase or remove your limits, please <1>contact our Customer Support team</1>.'
                                                        components={[
                                                            <span key={0} className='self-exclusion__text--red' />,
                                                            <a
                                                                key={1}
                                                                className='link link--orange'
                                                                rel='noopener noreferrer'
                                                                target='_blank'
                                                                href={getDerivComLink('/contact-us')}
                                                            />,
                                                        ]}
                                                    />
                                                </p>
                                                <Button
                                                    is_loading={isSubmitting}
                                                    is_disabled={isSubmitting}
                                                    primary
                                                    large
                                                    type='submit'
                                                    text={localize('Confirm my limits')}
                                                />
                                                <p className='self-exclusion__error'>{submit_error_message}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <h2 className='self-exclusion__header'>
                                                {localize('Your stake and loss limits')}
                                            </h2>
                                            <div className='self-exclusion__item-wrapper'>
                                                <div className='self-exclusion__item'>
                                                    <h3 className='self-exclusion__item-title'>{localize('Daily')}</h3>
                                                    <p className='self-exclusion__item-field'>
                                                        {localize('Max. total stake')}
                                                    </p>
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
                                                    <p className='self-exclusion__item-field'>
                                                        {localize('Max. total loss')}
                                                    </p>
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
                                                    <p className='self-exclusion__item-field'>
                                                        {localize('Max. total stake')}
                                                    </p>
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
                                                                error={
                                                                    touched.max_7day_turnover &&
                                                                    errors.max_7day_turnover
                                                                }
                                                            />
                                                        )}
                                                    </Field>
                                                    <p className='self-exclusion__item-field'>
                                                        {localize('Max. total loss')}
                                                    </p>
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
                                                                error={
                                                                    touched.max_7day_losses && errors.max_7day_losses
                                                                }
                                                            />
                                                        )}
                                                    </Field>
                                                </div>
                                                <div className='self-exclusion__item'>
                                                    <h3 className='self-exclusion__item-title'>
                                                        {localize('30 days')}
                                                    </h3>
                                                    <p className='self-exclusion__item-field'>
                                                        {localize('Max. total stake')}
                                                    </p>
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
                                                                error={
                                                                    touched.max_30day_turnover &&
                                                                    errors.max_7day_turnover
                                                                }
                                                            />
                                                        )}
                                                    </Field>
                                                    <p className='self-exclusion__item-field'>
                                                        {localize('Max. total loss')}
                                                    </p>
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
                                                                error={
                                                                    touched.max_30day_losses && errors.max_30day_losses
                                                                }
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
                                                                    values.timeout_until &&
                                                                    epochToMoment(values.timeout_until)
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
                                                                            ? toMoment(target.value).format(
                                                                                  'YYYY-MM-DD'
                                                                              )
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
                                                    onClick={() => this.goToConfirm(values)}
                                                    type='button'
                                                >
                                                    {localize('Save')}
                                                </Button>
                                            </div>
                                        </>
                                    )}
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
    logout: client.logout,
}))(SelfExclusion);
