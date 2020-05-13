import React from 'react';
import classNames from 'classnames';
import { Formik, Form, Field } from 'formik';
import { Timeline, CompositeCheckbox, Input, Button } from '@deriv/components';
import ObjectUtils from '@deriv/shared/utils/object';
import { localize } from '@deriv/translations';
import { WS } from 'Services/ws-methods';
import { connect } from 'Stores/connect';
import Loading from '../../../../../templates/app/components/loading.jsx';
import DemoMessage from '../../ErrorMessages/DemoMessage';
import LoadErrorMessage from '../../ErrorMessages/LoadErrorMessage';

const Card = ({ name, value, display_name, description, setFieldValue }) => {
    return (
        <div>
            <Field name={name}>
                {({ field }) => (
                    <CompositeCheckbox
                        {...field}
                        onChange={() => setFieldValue(name, !value)}
                        value={value}
                        className='api-token__checkbox'
                        defaultChecked={value}
                        label={display_name}
                        description={description}
                    />
                )}
            </Field>
        </div>
    );
};

class ApiToken extends React.Component {
    state = {
        api_tokens: [],
        is_loading: true,
        is_success: false,
        error_message: '',
    };

    initial_form = {
        token_name: '',
        read: true,
        trade: false,
        payments: false,
        admin: false,
    };

    validateFields = values => {
        const errors = {};

        if (!values.token_name) {
            errors.token_name = 'Token name is required.';
        }

        return errors;
    };

    handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        const new_token_scopes = Object.keys(values).filter(item => item !== 'token_name' && values[item]);

        const request = {
            api_token: 1,
            new_token: values.token_name,
            new_token_scopes,
        };

        const token_response = await WS.apiToken(request);
        if (token_response.error) {
            setFieldError('token_name', token_response.error.message);
        } else {
            this.setState({
                is_success: true,
                api_tokens: ObjectUtils.getPropertyValue(token_response, ['api_token', 'tokens']),
            });
        }

        setSubmitting(false);
    };

    getApiTokens = async () => {
        const token_response = await WS.apiToken({ api_token: 1 });
        if (token_response.error) {
            this.setState({
                is_loading: false,
                error_message: ObjectUtils.getPropertyValue(token_response, ['error', 'message']),
            });
        } else {
            this.setState({
                is_loading: false,
                api_tokens: ObjectUtils.getPropertyValue(token_response, ['api_token', 'tokens']),
            });
        }
    };

    componentDidMount() {
        this.getApiTokens();
    }

    render() {
        const { api_tokens, is_loading, is_success, error_message } = this.state;
        const { is_virtual, is_switching } = this.props;

        if (is_virtual) return <DemoMessage />;

        if (is_loading || is_switching) return <Loading is_fullscreen={false} className='account___intial-loader' />;

        if (error_message) return <LoadErrorMessage error_message={error_message} />;

        return (
            <section className='api-token'>
                <Formik initialValues={this.initial_form} onSubmit={this.handleSubmit} validate={this.validateFields}>
                    {({ values, errors, isValid, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
                        <Form noValidate>
                            <Timeline>
                                <Timeline.Item title={localize('Select tokens based on the access you need.')}>
                                    <Card
                                        name='read'
                                        value={values.read}
                                        setFieldValue={setFieldValue}
                                        display_name={localize('Read')}
                                        description={localize(
                                            'View account activity such as settings, limits, balance sheets, trade purchase history, and more.'
                                        )}
                                    />
                                    <Card
                                        name='trade'
                                        value={values.trade}
                                        display_name={localize('Trade')}
                                        setFieldValue={setFieldValue}
                                        description={localize(
                                            'Buy and sell contracts, renew expired purchases, and top up demo accounts.'
                                        )}
                                    />
                                    <Card
                                        name='payments'
                                        value={values.payments}
                                        display_name={localize('Payments')}
                                        setFieldValue={setFieldValue}
                                        description={localize(
                                            'Withdraw to payment agents, transfer funds between accounts, and set/clear cashier passwords.'
                                        )}
                                    />
                                    <Card
                                        name='admin'
                                        value={values.admin}
                                        display_name={localize('Admin')}
                                        setFieldValue={setFieldValue}
                                        description={localize(
                                            'Open accounts, manage settings, manage token usage, and more.'
                                        )}
                                    />
                                </Timeline.Item>
                                <Timeline.Item
                                    title={localize("Name your token and click on 'Create' to generate your token.")}
                                >
                                    <Field name='token_name'>
                                        {({ field }) => (
                                            <Input
                                                {...field}
                                                data-lpignore='true'
                                                type='text'
                                                label={localize('First name*')}
                                                value={values.token_name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={touched.token_name && errors.token_name}
                                            />
                                        )}
                                    </Field>
                                    <Button
                                        className={classNames('api-token__button', {
                                            'api-token__button--success': is_success,
                                        })}
                                        type='submit'
                                        is_disabled={isSubmitting || !isValid}
                                        has_effect
                                        is_loading={isSubmitting}
                                        is_submit_success={is_success}
                                        text={localize('Submit')}
                                        primary
                                        large
                                    />
                                </Timeline.Item>

                                <Timeline.Item title={localize('Copy and paste the token into the app.')}>
                                    <div>
                                        {api_tokens.map(token => (
                                            <>
                                                <p>name: {token.display_name}</p>
                                                <p>token: {token.token}</p>
                                                <p>scope: {token.scopes.join(', ')}</p>
                                                <br />
                                            </>
                                        ))}
                                    </div>
                                </Timeline.Item>
                            </Timeline>
                        </Form>
                    )}
                </Formik>
            </section>
        );
    }
}

export default connect(({ client }) => ({
    is_virtual: client.is_virtual,
    is_switching: client.is_switching,
}))(ApiToken);
