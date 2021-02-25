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
    StaticUrl,
    Text,
} from '@deriv/components';
import {
    getPropertyValue,
    toMoment,
    epochToMoment,
    isDesktop,
    isMobile,
    formatMoney,
    getDecimalPlaces,
    getCurrencyDisplayCode,
    validNumber,
} from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { WS } from 'Services/ws-methods';
import DemoMessage from 'Components/demo-message';
import LoadErrorMessage from 'Components/load-error-message';
import Article from './article.jsx';
import ArticleContent from './article-content.jsx';

class SelfExclusion extends React.Component {
    exclusion_data = {
        max_deposit: '',
        max_turnover: '',
        max_losses: '',
        max_7day_deposit: '',
        max_7day_turnover: '',
        max_7day_losses: '',
        max_30day_deposit: '',
        max_30day_turnover: '',
        max_30day_losses: '',
        session_duration_limit: '',
        timeout_until: '',
        exclude_until: '',
        max_balance: '',
        max_open_bets: '',
    };

    exclusion_fields_settings = {
        max_number: 9999999999999,
        max_open_positions: 999999999,
        six_weeks: 60480, // in minutes
    };

    exclusion_limits = {};

    exclusion_texts = {
        max_deposit: localize('Max. deposit limit per day'),
        max_turnover: localize('Max. total stake per day'),
        max_losses: localize('Max. total loss per day'),
        max_7day_deposit: localize('Max. deposit limit over 7 days'),
        max_7day_turnover: localize('Max. total stake over 7 days'),
        max_7day_losses: localize('Max. total loss over 7 days'),
        max_30day_deposit: localize('Max. deposit limit over 30 days'),
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
        show_article: false,
        submit_error_message: '',
    };

    resetState = () => {
        this.setState({
            is_loading: true,
            is_success: false,
            is_confirm_page: false,
            changed_attributes: [],
            error_message: '',
            self_exclusions: this.exclusion_data,
            show_confirm: false,
            submit_error_message: '',
        });
    };

    validateFields = values => {
        const { currency, is_eu, is_cr } = this.props;
        const errors = {};
        // Regex
        const max_number = this.exclusion_fields_settings.max_number;
        const max_open_positions = this.exclusion_fields_settings.max_open_positions;
        const six_weeks = this.exclusion_fields_settings.six_weeks; // in minutes

        const more_than_zero_message = localize('Please input number greater than 0');

        const getSmallestMinValue = decimals =>
            decimals === 0
                ? 1
                : `0.${Array(decimals - 1)
                      .fill(0)
                      .join('')}1`;

        const custom_validation = ['max_balance', 'max_open_bets', 'session_duration_limit'];

        const only_currency = [
            'max_deposit',
            'max_7day_deposit',
            'max_30day_deposit',
            'max_turnover',
            'max_losses',
            'max_7day_turnover',
            'max_7day_losses',
            'max_30day_turnover',
            'max_30day_losses',
        ];

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

        only_currency.forEach(item => {
            if (values[item]) {
                const { is_ok, message } = validNumber(values[item], {
                    type: 'float',
                    decimals: getDecimalPlaces(currency),
                    min: is_eu ? getSmallestMinValue(getDecimalPlaces(currency)) : null,
                    max: (is_eu && this.state.self_exclusions[item]) || max_number,
                });
                if (!is_ok) errors[item] = message;
            }
            if (this.state.self_exclusions[item] && !values[item] && !is_cr) {
                errors[item] = more_than_zero_message;
            }
        });

        if (values.session_duration_limit) {
            const { is_ok, message } = validNumber(values.session_duration_limit, {
                type: 'integer',
                min: is_eu ? 1 : null,
                max: is_eu ? this.state.self_exclusions.session_duration_limit : six_weeks,
            });
            if (!is_ok) errors.session_duration_limit = message;
            if (values.session_duration_limit > six_weeks) {
                errors.session_duration_limit = localize(
                    'Enter a value in minutes, up to 60480 minutes (equivalent to 6 weeks).'
                );
            }
        }

        if (values.max_open_bets) {
            const { is_ok, message } = validNumber(values.max_open_bets, {
                type: 'integer',
                min: is_eu ? 1 : null,
                max: (is_eu && this.exclusion_limits.get_limits.open_positions) || max_open_positions,
            });
            if (!is_ok) errors.max_open_bets = message;
        }

        if (values.max_balance) {
            const { is_ok, message } = validNumber(values.max_balance, {
                type: 'float',
                decimals: getDecimalPlaces(currency),
                min: is_eu ? getSmallestMinValue(getDecimalPlaces(currency)) : null,
                max: (is_eu && this.exclusion_limits.get_limits.account_balance) || max_number,
            });
            if (!is_ok) errors.max_balance = message;
        }

        custom_validation.forEach(item => {
            if (this.state.self_exclusions[item] && !values[item] && !is_cr) {
                errors[item] = more_than_zero_message;
            }
        });
        return errors;
    };

    handleSubmit = async (values, { setSubmitting }) => {
        const need_logout_exclusions = ['exclude_until', 'timeout_until'];
        const string_exclusions = ['exclude_until'];
        const has_need_logout = this.state.changed_attributes.some(attr => need_logout_exclusions.includes(attr));

        const makeRequest = () =>
            new Promise(resolve => {
                const request = {
                    set_self_exclusion: 1,
                };

                this.state.changed_attributes.forEach(attr => {
                    request[attr] = string_exclusions.includes(attr) ? values[attr] : +values[attr];
                });

                WS.authorized.setSelfExclusion(request).then(response => resolve(response));
            });

        if (has_need_logout) {
            if (this.state.show_confirm) {
                const response = await makeRequest();
                if (response.error) {
                    this.setState({
                        submit_error_message: response.error.message,
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
                    submit_error_message: response.error.message,
                });
            } else {
                setSubmitting(false);
                this.setState({ show_confirm: false, is_loading: true, is_confirm_page: false });
                this.getLimits();
                this.getSelfExclusion();
            }
        }
    };

    goToConfirm = values => {
        const changed_attributes = Object.keys(values).filter(key => values[key] !== this.state.self_exclusions[key]);
        this.setState({ changed_attributes, is_confirm_page: true });
    };

    backToReview = () => {
        this.setState({ show_confirm: false });
    };

    objectValuesToString = object => {
        Object.keys(object).forEach(item => {
            object[item] = `${object[item]}`;
        });

        return object;
    };

    toggleArticle = () => {
        this.setState({ show_article: !this.state.show_article });
    };

    componentWillUnmount() {
        this.setState({ changed_attributes: [] });
    }

    populateExclusionResponse = response => {
        if (response.error) {
            this.setState({
                is_loading: false,
                error_message: getPropertyValue(response, ['error', 'message']),
            });
        } else {
            const response_to_string = this.objectValuesToString(getPropertyValue(response, ['get_self_exclusion']));
            if (response_to_string.timeout_until) {
                response_to_string.timeout_until = +response_to_string.timeout_until;
            }
            this.setState({
                is_loading: false,
                self_exclusions: { ...this.exclusion_data, ...response_to_string },
            });
        }
    };

    getSelfExclusion = async () => {
        this.setState({ is_loading: true });
        const get_self_exclusion_response = await WS.authorized.getSelfExclusion({ get_self_exclusion: 1 });
        this.populateExclusionResponse(get_self_exclusion_response);
    };

    getLimits = async () => {
        this.setState({ is_loading: true });
        this.exclusion_limits = await WS.authorized.getLimits({ get_limits: 1 });
    };

    getMaxLength = field => {
        const { currency, is_cr } = this.props;

        const decimals_length = getDecimalPlaces(currency);
        const isIntegerField = value => /session_duration_limit|max_open_bets/.test(value);
        const getLength = value =>
            value.toString().length + (isIntegerField(field) || decimals_length === 0 ? 0 : decimals_length + 1); // add 1 to allow typing dot

        if (/max_open_bets/.test(field) && this.exclusion_limits.get_limits?.open_positions && !is_cr)
            return getLength(this.exclusion_limits.get_limits.open_positions);

        if (/max_balance/.test(field) && this.exclusion_limits.get_limits?.account_balance && !is_cr)
            return getLength(this.exclusion_limits.get_limits.account_balance);

        if (!this.state.self_exclusions[field] || is_cr) {
            if (/max_open_bets/.test(field)) return 9; // TODO: remove when the error is fixed on BE
            return getLength(this.exclusion_fields_settings.max_number);
        }

        return getLength(this.state.self_exclusions[field]);
    };

    componentDidMount() {
        const { is_virtual } = this.props;
        if (is_virtual) {
            this.setState({ is_loading: false });
        } else {
            this.getLimits();
            this.getSelfExclusion();
        }
    }
    componentDidUpdate(prev_props) {
        if (prev_props.is_switching !== this.props.is_switching) {
            this.resetState();
            this.getLimits();
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
            show_article,
            submit_error_message,
        } = this.state;
        const { is_virtual, is_switching, currency, is_eu, is_tablet } = this.props;
        const { six_weeks } = this.exclusion_fields_settings;

        if (is_virtual) return <DemoMessage />;

        if (is_loading || is_switching) return <Loading is_fullscreen={false} className='account__initial-loader' />;

        if (error_message) return <LoadErrorMessage error_message={error_message} />;

        const currency_display = getCurrencyDisplayCode(currency);
        const session_duration_digits = six_weeks.toString().length;

        return (
            <section className='self-exclusion'>
                <Div100vhContainer className='self-exclusion__wrapper' is_disabled={isDesktop()} height_offset='80px'>
                    <ThemedScrollbars className='self-exclusion__scrollbars' is_bypassed={isMobile()}>
                        <MobileWrapper>
                            <Article toggleArticle={this.toggleArticle} />
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
                                handleChange,
                                handleBlur,
                                isSubmitting,
                                handleSubmit,
                                setFieldValue,
                            }) => (
                                <Form className='self-exclusion__form' noValidate>
                                    <Modal
                                        className='self_exclusion__article-modal'
                                        is_open={show_article}
                                        toggleModal={this.toggleArticle}
                                    >
                                        <ThemedScrollbars>
                                            <ArticleContent toggleModal={this.toggleArticle} />
                                        </ThemedScrollbars>
                                    </Modal>
                                    {is_confirm_page ? (
                                        <React.Fragment>
                                            <Modal
                                                className='self_exclusion__modal'
                                                is_open={show_confirm}
                                                has_close_icon={false}
                                            >
                                                <div className='self-exclusion__popup'>
                                                    <Icon icon='IcStop' className='self-exclusion__popup-image' />
                                                    <Text
                                                        as='h4'
                                                        color='prominent'
                                                        align='center'
                                                        className='self-exclusion__popup-header'
                                                    >
                                                        {localize('Save new limits?')}
                                                    </Text>
                                                    <Text as='p' className='self-exclusion__popup-desc'>
                                                        {localize(
                                                            'Remember: You cannot log in to your account until the selected date.'
                                                        )}
                                                    </Text>
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
                                                    this.setState({ is_confirm_page: false, submit_error_message: '' });
                                                }}
                                                className='self-exclusion__back'
                                            >
                                                <Icon icon='IcArrowLeftBold' />
                                                <Text as='p' size='xs' weight='bold'>
                                                    {localize('Back')}
                                                </Text>
                                            </div>
                                            <div className='self-exclusion__confirm'>
                                                <Text
                                                    as='h2'
                                                    color='prominent'
                                                    weight='bold'
                                                    align='center'
                                                    className='self-exclusion__confirm-header'
                                                >
                                                    {localize('You have set the following limits:')}
                                                </Text>
                                                {changed_attributes.map((key, idx) => {
                                                    const need_date_format = ['exclude_until', 'timeout_until'];
                                                    const need_money_format = [
                                                        'max_deposit',
                                                        'max_7day_deposit',
                                                        'max_30day_deposit',
                                                        'max_total_stake',
                                                        'max_turnover',
                                                        'max_losses',
                                                        'max_7day_turnover',
                                                        'max_7day_losses',
                                                        'max_30day_turnover',
                                                        'max_30day_losses',
                                                        'max_balance',
                                                    ];
                                                    const need_minutes = ['session_duration_limit'];
                                                    const need_amount = ['max_open_bets'];
                                                    let value = '';
                                                    if (need_date_format.includes(key)) {
                                                        value = toMoment(values[key]).format('DD/MM/YYYY');
                                                    } else if (need_money_format.includes(key)) {
                                                        value = `${formatMoney(
                                                            currency,
                                                            +values[key],
                                                            true
                                                        )} ${currency_display}`;
                                                    } else if (need_minutes.includes(key)) {
                                                        value = localize('{{value}} mins', { value: values[key] });
                                                    } else if (need_amount.includes(key)) {
                                                        value = `${values[key]}`;
                                                    }
                                                    const checked_value = +values[key] === 0 ? 'Removed' : value;
                                                    return (
                                                        <div key={idx} className='self-exclusion__confirm-item'>
                                                            <Text as='p' size='xs'>
                                                                {this.exclusion_texts[key]}
                                                            </Text>
                                                            <Text as='p' size='xs' align='right' weight='bold'>
                                                                {checked_value}
                                                            </Text>
                                                        </div>
                                                    );
                                                })}
                                                <Text
                                                    as='p'
                                                    size='xs'
                                                    align='center'
                                                    className='self-exclusion__confirm-note'
                                                >
                                                    {is_eu ? (
                                                        <Localize
                                                            i18n_default_text='You’ll be able to adjust these limits at any time. You can reduce your limits from the <0>self-exclusion page</0>. To increase or remove your limits, please contact our <1>Customer Support team</1>.'
                                                            components={[
                                                                <Text
                                                                    key={0}
                                                                    size='xs'
                                                                    color='loss-danger'
                                                                    weight='bold'
                                                                />,
                                                                <StaticUrl
                                                                    key={1}
                                                                    className='link link--orange'
                                                                    href='/contact-us'
                                                                />,
                                                            ]}
                                                        />
                                                    ) : (
                                                        <Localize
                                                            i18n_default_text='We’ll update your limits. Click <0>Agree and accept</0> to acknowledge that you are fully responsible for your actions, and we are not liable for any addiction or loss.'
                                                            components={[
                                                                <strong
                                                                    key={0}
                                                                    className='self-exclusion__confirm-bold'
                                                                />,
                                                            ]}
                                                        />
                                                    )}
                                                </Text>
                                                <Text
                                                    as='p'
                                                    size='xs'
                                                    align='center'
                                                    color='loss-danger'
                                                    className='self-exclusion__error'
                                                >
                                                    {submit_error_message}
                                                </Text>
                                                {is_eu ? (
                                                    <Button
                                                        is_loading={isSubmitting}
                                                        is_disabled={isSubmitting}
                                                        primary
                                                        large
                                                        type='submit'
                                                        text={localize('Confirm my limits')}
                                                    />
                                                ) : (
                                                    <Button
                                                        is_loading={isSubmitting}
                                                        is_disabled={isSubmitting}
                                                        primary
                                                        large
                                                        type='submit'
                                                        text={localize('Agree and accept')}
                                                    />
                                                )}
                                            </div>
                                        </React.Fragment>
                                    ) : (
                                        <React.Fragment>
                                            <Text
                                                as='h2'
                                                size='xs'
                                                weight='bold'
                                                color='prominent'
                                                className='self-exclusion__header'
                                            >
                                                {localize('Your stake and loss limits')}
                                            </Text>
                                            <div className='self-exclusion__item-wrapper'>
                                                <div className='self-exclusion__item'>
                                                    <Text
                                                        as='h3'
                                                        size='xs'
                                                        weight='bold'
                                                        color='prominent'
                                                        className='self-exclusion__item-title'
                                                    >
                                                        {localize('24 hours')}
                                                    </Text>
                                                    <Text as='p' size='xs' className='self-exclusion__item-field'>
                                                        {localize('Max. total stake')}
                                                    </Text>
                                                    <Field name='max_turnover'>
                                                        {({ field }) => (
                                                            <Input
                                                                {...field}
                                                                data-lpignore='true'
                                                                className='self-exclusion__input'
                                                                label={currency_display}
                                                                value={values.max_turnover}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                maxLength={this.getMaxLength('max_turnover')}
                                                                required
                                                                error={errors.max_turnover}
                                                            />
                                                        )}
                                                    </Field>
                                                    <Text as='p' size='xs' className='self-exclusion__item-field'>
                                                        {localize('Max. total loss')}
                                                    </Text>
                                                    <Field name='max_losses'>
                                                        {({ field }) => (
                                                            <Input
                                                                {...field}
                                                                data-lpignore='true'
                                                                className='self-exclusion__input'
                                                                label={currency_display}
                                                                value={values.max_losses}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                maxLength={this.getMaxLength('max_losses')}
                                                                required
                                                                error={errors.max_losses}
                                                            />
                                                        )}
                                                    </Field>
                                                </div>
                                                <div className='self-exclusion__item'>
                                                    <Text
                                                        as='h3'
                                                        size='xs'
                                                        weight='bold'
                                                        color='prominent'
                                                        className='self-exclusion__item-title'
                                                    >
                                                        {localize('7 days')}
                                                    </Text>
                                                    <Text as='p' size='xs' className='self-exclusion__item-field'>
                                                        {localize('Max. total stake')}
                                                    </Text>
                                                    <Field name='max_7day_turnover'>
                                                        {({ field }) => (
                                                            <Input
                                                                {...field}
                                                                data-lpignore='true'
                                                                className='self-exclusion__input'
                                                                label={currency_display}
                                                                value={values.max_7day_turnover}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                maxLength={this.getMaxLength('max_7day_turnover')}
                                                                required
                                                                error={errors.max_7day_turnover}
                                                            />
                                                        )}
                                                    </Field>
                                                    <Text as='p' size='xs' className='self-exclusion__item-field'>
                                                        {localize('Max. total loss')}
                                                    </Text>
                                                    <Field name='max_7day_losses'>
                                                        {({ field }) => (
                                                            <Input
                                                                {...field}
                                                                data-lpignore='true'
                                                                className='self-exclusion__input'
                                                                label={currency_display}
                                                                value={values.max_7day_losses}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                maxLength={this.getMaxLength('max_7day_losses')}
                                                                required
                                                                error={errors.max_7day_losses}
                                                            />
                                                        )}
                                                    </Field>
                                                </div>
                                                <div className='self-exclusion__item'>
                                                    <Text
                                                        as='h3'
                                                        size='xs'
                                                        weight='bold'
                                                        color='prominent'
                                                        className='self-exclusion__item-title'
                                                    >
                                                        {localize('30 days')}
                                                    </Text>
                                                    <Text as='p' size='xs' className='self-exclusion__item-field'>
                                                        {localize('Max. total stake')}
                                                    </Text>
                                                    <Field name='max_30day_turnover'>
                                                        {({ field }) => (
                                                            <Input
                                                                {...field}
                                                                data-lpignore='true'
                                                                className='self-exclusion__input'
                                                                label={currency_display}
                                                                value={values.max_30day_turnover}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                maxLength={this.getMaxLength('max_30day_turnover')}
                                                                required
                                                                error={errors.max_30day_turnover}
                                                            />
                                                        )}
                                                    </Field>
                                                    <Text as='p' size='xs' className='self-exclusion__item-field'>
                                                        {localize('Max. total loss')}
                                                    </Text>
                                                    <Field name='max_30day_losses'>
                                                        {({ field }) => (
                                                            <Input
                                                                {...field}
                                                                data-lpignore='true'
                                                                className='self-exclusion__input'
                                                                label={currency_display}
                                                                value={values.max_30day_losses}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                maxLength={this.getMaxLength('max_30day_losses')}
                                                                required
                                                                error={errors.max_30day_losses}
                                                            />
                                                        )}
                                                    </Field>
                                                </div>
                                            </div>
                                            <Text
                                                as='h2'
                                                size='xs'
                                                weight='bold'
                                                color='prominent'
                                                className='self-exclusion__header'
                                            >
                                                {localize('Your session and login limits')}
                                            </Text>
                                            <div className='self-exclusion__item-wrapper'>
                                                <div className='self-exclusion__item'>
                                                    <Text as='p' size='xs' className='self-exclusion__item-field'>
                                                        {localize(
                                                            'You will be automatically logged out from each session after this time limit.'
                                                        )}
                                                    </Text>
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
                                                                maxLength={session_duration_digits}
                                                                required
                                                                error={errors.session_duration_limit}
                                                            />
                                                        )}
                                                    </Field>
                                                </div>
                                                <div className='self-exclusion__item'>
                                                    <Text as='p' size='xs' className='self-exclusion__item-field'>
                                                        {localize(
                                                            'You will not be able to log in to your account until this date (up to 6 weeks from today).'
                                                        )}
                                                    </Text>
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
                                                                onChange={({ target }) =>
                                                                    setFieldValue(
                                                                        'timeout_until',
                                                                        target?.value ? target.value.unix() : '',
                                                                        true
                                                                    )
                                                                }
                                                                required
                                                                readOnly
                                                                error={errors.timeout_until}
                                                            />
                                                        )}
                                                    </Field>
                                                </div>
                                                <div className='self-exclusion__item'>
                                                    <Text as='p' size='xs' className='self-exclusion__item-field'>
                                                        {localize(
                                                            'Your account will be excluded from the website until this date (at least 6 months, up to 5 years).'
                                                        )}
                                                    </Text>
                                                    <Field name='exclude_until'>
                                                        {({ field }) => (
                                                            <DatePicker
                                                                {...field}
                                                                alignment={is_tablet ? 'bottom' : 'left'}
                                                                className='self-exclusion__input'
                                                                label={localize('Date')}
                                                                value={values.exclude_until}
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
                                                                error={errors.exclude_until}
                                                            />
                                                        )}
                                                    </Field>
                                                </div>
                                            </div>
                                            {values.exclude_until && (this.props.is_mlt || this.props.is_mx) && (
                                                <div className='self-exclusion__warning'>
                                                    <Icon
                                                        icon='IcAlertWarning'
                                                        className='self-exclusion__warning-icon'
                                                    />
                                                    <div className='self-exclusion__warning-textbox'>
                                                        <Text as='p' size='xxxs'>
                                                            {localize(
                                                                'Self-exclusion on the website only applies to your Deriv.com account and does not include other companies or websites.'
                                                            )}
                                                        </Text>
                                                        <Text as='p' size='xxxs'>
                                                            {this.props.is_mlt ? (
                                                                <Localize
                                                                    i18n_default_text='If you are a UK resident, to self-exclude from all online gambling companies licensed in Great Britain, go to <0>www.gamstop.co.uk</0>.'
                                                                    components={[
                                                                        <a
                                                                            key={0}
                                                                            className='self-exclusion__warning-link'
                                                                            rel='noopener noreferrer'
                                                                            target='_blank'
                                                                            href='https://www.gamstop.co.uk'
                                                                        />,
                                                                    ]}
                                                                />
                                                            ) : (
                                                                <Localize
                                                                    i18n_default_text='To self-exclude from all online gambling companies licensed in Great Britain, go to <0>www.gamstop.co.uk</0>.'
                                                                    components={[
                                                                        <a
                                                                            key={0}
                                                                            className='self-exclusion__warning-link'
                                                                            rel='noopener noreferrer'
                                                                            target='_blank'
                                                                            href='https://www.gamstop.co.uk'
                                                                        />,
                                                                    ]}
                                                                />
                                                            )}
                                                        </Text>
                                                        <Text as='p' size='xxxs'>
                                                            <Localize
                                                                i18n_default_text='For more information and assistance to counselling and support services, please visit <0>begambleaware.org</0>.'
                                                                components={[
                                                                    <a
                                                                        key={0}
                                                                        className='self-exclusion__warning-link'
                                                                        rel='noopener noreferrer'
                                                                        target='_blank'
                                                                        href='http://begambleaware.org'
                                                                    />,
                                                                ]}
                                                            />
                                                        </Text>
                                                    </div>
                                                </div>
                                            )}
                                            {(this.props.is_mlt || this.props.is_mf || this.props.is_mx) && (
                                                <React.Fragment>
                                                    <Text
                                                        as='h2'
                                                        size='xs'
                                                        weight='bold'
                                                        color='prominent'
                                                        className='self-exclusion__header'
                                                    >
                                                        {localize('Your maximum deposit limit')}
                                                    </Text>
                                                    <div className='self-exclusion__item-wrapper'>
                                                        <div className='self-exclusion__item'>
                                                            <Text
                                                                as='h3'
                                                                size='xs'
                                                                weight='bold'
                                                                color='prominent'
                                                                className='self-exclusion__item-title'
                                                            >
                                                                {localize('24 hours')}
                                                            </Text>
                                                            <Text
                                                                as='p'
                                                                size='xs'
                                                                className='self-exclusion__item-field'
                                                            >
                                                                {localize('Max. deposit limit')}
                                                            </Text>
                                                            <Field name='max_deposit'>
                                                                {({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        data-lpignore='true'
                                                                        className='self-exclusion__input'
                                                                        label={currency}
                                                                        value={values.max_deposit}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        maxLength={this.getMaxLength('max_deposit')}
                                                                        required
                                                                        error={errors.max_deposit}
                                                                    />
                                                                )}
                                                            </Field>
                                                        </div>
                                                        <div className='self-exclusion__item'>
                                                            <Text
                                                                as='h3'
                                                                size='xs'
                                                                weight='bold'
                                                                color='prominent'
                                                                className='self-exclusion__item-title'
                                                            >
                                                                {localize('7 days')}
                                                            </Text>
                                                            <Text
                                                                as='p'
                                                                size='xs'
                                                                className='self-exclusion__item-field'
                                                            >
                                                                {localize('Max. deposit limit')}
                                                            </Text>
                                                            <Field name='max_7day_deposit'>
                                                                {({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        data-lpignore='true'
                                                                        className='self-exclusion__input'
                                                                        label={currency}
                                                                        value={values.max_7day_deposit}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        maxLength={this.getMaxLength(
                                                                            'max_7day_deposit'
                                                                        )}
                                                                        required
                                                                        error={errors.max_7day_deposit}
                                                                    />
                                                                )}
                                                            </Field>
                                                        </div>
                                                        <div className='self-exclusion__item'>
                                                            <Text
                                                                as='h3'
                                                                size='xs'
                                                                weight='bold'
                                                                color='prominent'
                                                                className='self-exclusion__item-title'
                                                            >
                                                                {localize('30 days')}
                                                            </Text>
                                                            <Text
                                                                as='p'
                                                                size='xs'
                                                                className='self-exclusion__item-field'
                                                            >
                                                                {localize('Max. deposit limit')}
                                                            </Text>
                                                            <Field name='max_30day_deposit'>
                                                                {({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        data-lpignore='true'
                                                                        className='self-exclusion__input'
                                                                        label={currency}
                                                                        value={values.max_30day_deposit}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        maxLength={this.getMaxLength(
                                                                            'max_30day_deposit'
                                                                        )}
                                                                        required
                                                                        error={errors.max_30day_deposit}
                                                                    />
                                                                )}
                                                            </Field>
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            )}
                                            <Text
                                                as='h2'
                                                size='xs'
                                                weight='bold'
                                                color='prominent'
                                                className='self-exclusion__header'
                                            >
                                                {localize('Your maximum account balance and open positions')}
                                            </Text>
                                            <div className='self-exclusion__item-wrapper'>
                                                <div className='self-exclusion__item'>
                                                    <Text as='p' size='xs' className='self-exclusion__item-field'>
                                                        {localize(
                                                            'Once your account balance reaches this amount, you will not be able to deposit funds into your account.'
                                                        )}
                                                    </Text>
                                                    <Field name='max_balance'>
                                                        {({ field }) => (
                                                            <Input
                                                                {...field}
                                                                data-lpignore='true'
                                                                className='self-exclusion__input'
                                                                label={currency_display}
                                                                value={values.max_balance}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                maxLength={this.getMaxLength('max_balance')}
                                                                required
                                                                error={errors.max_balance}
                                                            />
                                                        )}
                                                    </Field>
                                                </div>
                                                <div className='self-exclusion__item'>
                                                    <Text as='p' size='xs' className='self-exclusion__item-field'>
                                                        {localize('You can only open positions up to this amount.')}
                                                    </Text>
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
                                                                maxLength={this.getMaxLength('max_open_bets')}
                                                                required
                                                                error={errors.max_open_bets}
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
                                        </React.Fragment>
                                    )}
                                </Form>
                            )}
                        </Formik>
                    </ThemedScrollbars>
                    <DesktopWrapper>
                        <Article toggleArticle={this.toggleArticle} />
                    </DesktopWrapper>
                </Div100vhContainer>
            </section>
        );
    }
}

export default connect(({ client, ui }) => ({
    is_tablet: ui.is_tablet,
    currency: client.currency,
    is_virtual: client.is_virtual,
    is_switching: client.is_switching,
    is_cr: client.standpoint.svg,
    is_eu: client.is_eu,
    is_mlt: client.landing_company_shortcode === 'malta',
    is_mf: client.landing_company_shortcode === 'maltainvest',
    is_mx: client.landing_company_shortcode === 'iom',
    logout: client.logout,
}))(SelfExclusion);
