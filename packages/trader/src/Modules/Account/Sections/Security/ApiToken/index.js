import React from 'react';
import classNames from 'classnames';
import { Formik, Form, Field } from 'formik';
import { Timeline, CompositeCheckbox, Input, Button, Table, Icon, Popover, Dialog } from '@deriv/components';
import { copyToClipboard } from '_common/utility';
import ObjectUtils from '@deriv/shared/utils/object';
import StringUtils from '@deriv/shared/utils/string';
import DateUtils from '@deriv/shared/utils/date';
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

const Clipboard = ({ token }) => {
    const [is_copied, setIsCopied] = React.useState(false);

    const onClick = () => {
        copyToClipboard(token);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    return (
        <>
            {!is_copied && (
                <Popover
                    alignment='top'
                    classNameBubble='api-token__popover'
                    is_bubble_hover_enabled
                    message={localize('Click here to copy your token.')}
                >
                    <Icon icon='IcClipboard' className='api-token__clipboard' onClick={onClick} />
                </Popover>
            )}
            {is_copied && (
                <Popover
                    alignment='top'
                    classNameBubble='api-token__popover'
                    is_bubble_hover_enabled
                    message={localize('Token copied!')}
                    relative_render
                >
                    <Icon icon='IcInfoOutline' className='api-token__clipboard' />
                </Popover>
            )}
        </>
    );
};

class ApiToken extends React.Component {
    state = {
        api_tokens: [],
        is_loading: true,
        is_success: false,
        error_message: '',
        show_delete: false,
        dispose_token: '',
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

    handleSubmit = async (values, { setSubmitting, setFieldError, resetForm }) => {
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
            setTimeout(() => {
                this.setState({ is_success: false });
            }, 2000);
        }

        setSubmitting(false);
        resetForm();
    };

    populateTokenResponse = response => {
        if (response.error) {
            this.setState({
                is_loading: false,
                error_message: ObjectUtils.getPropertyValue(response, ['error', 'message']),
            });
        } else {
            this.setState({
                is_loading: false,
                api_tokens: ObjectUtils.getPropertyValue(response, ['api_token', 'tokens']),
            });
        }
    };

    getApiTokens = async () => {
        const token_response = await WS.authorized.apiToken({ api_token: 1 });
        this.populateTokenResponse(token_response);
    };

    deleteToken = async token => {
        const token_response = await WS.authorized.apiToken({ api_token: 1, delete_token: token });
        this.populateTokenResponse(token_response);
        this.closeDialog();
    };

    showDialog = token => {
        this.setState({ dispose_token: token, show_delete: true });
    };

    closeDialog = () => {
        this.setState({ dispose_token: '', show_delete: false });
    };

    componentDidMount() {
        const { is_virtual } = this.props;
        if (is_virtual) {
            this.setState({ is_loading: false });
        } else {
            this.getApiTokens();
        }
    }

    componentWillUnmount() {
        this.setState({ dispose_token: '' });
    }

    render() {
        const { api_tokens, is_loading, is_success, error_message, show_delete, dispose_token } = this.state;
        const { is_virtual, is_switching } = this.props;

        if (is_virtual) return <DemoMessage />;

        if (is_loading || is_switching) return <Loading is_fullscreen={false} className='account___intial-loader' />;

        if (error_message) return <LoadErrorMessage error_message={error_message} />;

        return (
            <section className='api-token'>
                <Dialog is_visible={show_delete}>
                    <div>
                        {localize('Confirm delete token?')} {dispose_token}
                    </div>
                    <Button type='button' primary small onClick={() => this.deleteToken(dispose_token)}>
                        Delete
                    </Button>
                    <Button type='button' primary small onClick={this.closeDialog}>
                        Close
                    </Button>
                </Dialog>
                <Formik initialValues={this.initial_form} onSubmit={this.handleSubmit} validate={this.validateFields}>
                    {({ values, errors, isValid, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
                        <Form noValidate>
                            <Timeline>
                                <Timeline.Item title={localize('Select tokens based on the access you need.')}>
                                    <div className='api-token__checkbox-wrapper'>
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
                                    </div>
                                </Timeline.Item>
                                <Timeline.Item
                                    title={localize("Name your token and click on 'Create' to generate your token.")}
                                >
                                    <div className='api-token__input-group'>
                                        <Field name='token_name'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    data-lpignore='true'
                                                    type='text'
                                                    className='api-token__input'
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
                                    </div>
                                </Timeline.Item>

                                <Timeline.Item title={localize('Copy and paste the token into the app.')}>
                                    <div>
                                        <Table>
                                            <Table.Header>
                                                <Table.Row className='api-token__table-row'>
                                                    <Table.Head>{localize('Name')}</Table.Head>
                                                    <Table.Head>{localize('Token')}</Table.Head>
                                                    <Table.Head>{localize('Scope')}</Table.Head>
                                                    <Table.Head>{localize('Last used')}</Table.Head>
                                                    <Table.Head>{localize('Action')}</Table.Head>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                {api_tokens.map((token, idx) => {
                                                    const titled_scopes = token.scopes.map(scope =>
                                                        StringUtils.toTitleCase(scope)
                                                    );
                                                    const mapped_scopes =
                                                        titled_scopes.length === 4 ? 'All' : titled_scopes.join(', ');
                                                    const date_format = token.last_used
                                                        ? DateUtils.formatDate(new Date(token.last_used), 'DD/MM/YYYY')
                                                        : localize('Never');
                                                    return (
                                                        <Table.Row key={idx} className='api-token__table-row'>
                                                            <Table.Cell>{token.display_name}</Table.Cell>
                                                            <Table.Cell>
                                                                <div className='api-token__clipboard-wrapper'>
                                                                    {token.token} <Clipboard token={token.token} />
                                                                </div>
                                                            </Table.Cell>
                                                            <Table.Cell>{mapped_scopes}</Table.Cell>
                                                            <Table.Cell>{date_format}</Table.Cell>
                                                            <Table.Cell>
                                                                <Button
                                                                    type='button'
                                                                    secondary
                                                                    small
                                                                    onClick={() => this.showDialog(token.token)}
                                                                >
                                                                    {localize('Delete')}
                                                                </Button>
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    );
                                                })}
                                            </Table.Body>
                                        </Table>
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
