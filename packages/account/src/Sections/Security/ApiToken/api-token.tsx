import React from 'react';
import classNames from 'classnames';
import { Formik, Form, Field, FormikErrors, FieldProps, FormikHelpers } from 'formik';
import { useApiToken } from '@deriv/api';
import { ApiToken as TApitoken } from '@deriv/api-types';
import { Timeline, Input, Button, ThemedScrollbars, Loading } from '@deriv/components';
import { getPropertyValue } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { TToken } from 'Types';
import { ApiTokenContext, ApiTokenArticle, ApiTokenCard, ApiTokenTable } from 'Components/api-token';
import InlineNoteWithIcon from 'Components/inline-note-with-icon';
import LoadErrorMessage from 'Components/load-error-message';
import { getApiTokenCardDetails, TOKEN_LIMITS } from 'Constants/api-token-card-details';
import './api-token.scss';

type AptTokenState = {
    api_tokens: NonNullable<TToken[]>;
    error_message: string;
};

type TApiTokenForm = {
    token_name: string;
    read: boolean;
    trade: boolean;
    payments: boolean;
    trading_information: boolean;
    admin: boolean;
};

const ApiToken = () => {
    const { client, ui } = useStore();
    const { is_switching } = client;
    const { is_desktop, is_mobile } = ui;

    const { api_token_data, getApiToken, createApiToken, deleteApiToken, isSuccess, isLoading, isError, error } =
        useApiToken();

    const [state, setState] = React.useReducer(
        (prev_state: Partial<AptTokenState>, value: Partial<AptTokenState>) => ({
            ...prev_state,
            ...value,
        }),
        {
            api_tokens: [],
            error_message: '',
        }
    );

    React.useEffect(() => {
        /**
         * Fetch all API tokens
         */
        getApiToken();
    }, [getApiToken]);

    React.useEffect(() => {
        /**
         * Update API token list when new token is created or a token is deleted
         */
        if (isSuccess) {
            setState({
                api_tokens: getPropertyValue(api_token_data, ['tokens']),
            });
        } else if (isError) {
            setState({
                error_message: getPropertyValue(error, ['message']),
            });
        }
    }, [isSuccess, api_token_data, isError, error]);

    const initial_form: TApiTokenForm = {
        token_name: '',
        read: false,
        trade: false,
        payments: false,
        trading_information: false,
        admin: false,
    };

    const validateFields = (values: TApiTokenForm) => {
        const errors: FormikErrors<TApiTokenForm> = {};
        const token_name = values.token_name && values.token_name.trim();

        if (!token_name) {
            errors.token_name = localize('Please enter a token name.');
        } else if (!/^[A-Za-z0-9\s_]+$/g.test(token_name)) {
            errors.token_name = localize('Only letters, numbers, and underscores are allowed.');
        } else if (token_name.length < TOKEN_LIMITS.MIN) {
            errors.token_name = localize(
                'Length of token name must be between {{MIN_TOKEN}} and {{MAX_TOKEN}} characters.',
                {
                    MIN_TOKEN: TOKEN_LIMITS.MIN,
                    MAX_TOKEN: TOKEN_LIMITS.MAX,
                }
            );
        } else if (token_name.length > TOKEN_LIMITS.MAX) {
            errors.token_name = localize('Maximum {{MAX_TOKEN}} characters.', { MAX_TOKEN: TOKEN_LIMITS.MAX });
        }

        return errors;
    };

    const selectedTokenScope = (values: TApiTokenForm) =>
        Object.keys(values).filter(
            item => item !== 'token_name' && Boolean(values[item as keyof TApiTokenForm])
        ) as NonNullable<NonNullable<TApitoken['tokens']>[0]['scopes']>;

    const handleSubmit = (values: TApiTokenForm, { setSubmitting, resetForm }: FormikHelpers<TApiTokenForm>) => {
        createApiToken({
            new_token: values.token_name,
            new_token_scopes: selectedTokenScope(values),
        });
        resetForm();
        setSubmitting(false);
    };

    const deleteToken = (token: string) => {
        deleteApiToken(token);
    };

    const { api_tokens, error_message } = state;

    if (is_switching) {
        return <Loading is_fullscreen={false} className='account__initial-loader' />;
    }

    if (error_message) {
        return <LoadErrorMessage error_message={error_message} />;
    }

    const context_value = {
        api_tokens,
        deleteToken,
        isSuccess,
    };

    const api_token_card_array = getApiTokenCardDetails();

    return (
        <React.Fragment>
            <ApiTokenContext.Provider value={context_value}>
                <section className='da-api-token'>
                    <div className='da-api-token__wrapper'>
                        <ThemedScrollbars className='da-api-token__scrollbars' is_bypassed={is_mobile}>
                            {is_mobile && <ApiTokenArticle />}
                            <Formik initialValues={initial_form} onSubmit={handleSubmit} validate={validateFields}>
                                {({
                                    values,
                                    errors,
                                    isValid,
                                    dirty,
                                    touched,
                                    handleChange,
                                    handleBlur,
                                    isSubmitting,
                                    setFieldTouched,
                                }) => (
                                    <Form noValidate>
                                        <Timeline className='da-api-token__timeline' line_height='xxxl'>
                                            <Timeline.Item
                                                item_title={
                                                    <Localize i18n_default_text='Select scopes based on the access you need.' />
                                                }
                                            >
                                                <div className='da-api-token__checkbox-wrapper'>
                                                    {api_token_card_array.map(card => (
                                                        <ApiTokenCard
                                                            key={card.name}
                                                            name={card.name}
                                                            display_name={card.display_name}
                                                            description={card.description}
                                                        >
                                                            {card.name === 'admin' && (
                                                                <InlineNoteWithIcon
                                                                    icon='IcAlertWarning'
                                                                    message={
                                                                        <Localize i18n_default_text='To avoid loss of funds, do not share tokens with the Admin scope with unauthorised parties.' />
                                                                    }
                                                                    title={<Localize i18n_default_text='Note' />}
                                                                />
                                                            )}
                                                        </ApiTokenCard>
                                                    ))}
                                                </div>
                                            </Timeline.Item>
                                            <Timeline.Item
                                                item_title={
                                                    <Localize i18n_default_text="Name your token and click on 'Create' to generate your token." />
                                                }
                                            >
                                                <div className='da-api-token__input-group'>
                                                    <Field name='token_name'>
                                                        {({ field }: FieldProps<string | boolean>) => (
                                                            <Input
                                                                {...field}
                                                                data-lpignore='true'
                                                                type='text'
                                                                className='da-api-token__input dc-input__input-group'
                                                                label={<Localize i18n_default_text='Token name' />}
                                                                value={values.token_name}
                                                                onChange={e => {
                                                                    setFieldTouched('token_name', true);
                                                                    handleChange(e);
                                                                }}
                                                                onBlur={handleBlur}
                                                                hint={
                                                                    <Localize i18n_default_text='Length of token name must be between 2 and 32 characters.' />
                                                                }
                                                                required
                                                                error={
                                                                    touched.token_name && errors.token_name
                                                                        ? errors.token_name
                                                                        : undefined
                                                                }
                                                            />
                                                        )}
                                                    </Field>
                                                    <Button
                                                        className={classNames(
                                                            'dc-btn__button-group',
                                                            'da-api-token__button',
                                                            {
                                                                'da-api-token__button--success': isSuccess,
                                                            }
                                                        )}
                                                        type='submit'
                                                        is_disabled={
                                                            !dirty ||
                                                            isSubmitting ||
                                                            !isValid ||
                                                            !selectedTokenScope(values).length
                                                        }
                                                        has_effect
                                                        is_loading={isSubmitting}
                                                        is_submit_success={isLoading}
                                                        primary
                                                        large
                                                    >
                                                        <Localize i18n_default_text='Create' />
                                                    </Button>
                                                </div>
                                            </Timeline.Item>
                                            <Timeline.Item
                                                item_title={
                                                    <Localize i18n_default_text='Copy and paste the token into the app.' />
                                                }
                                            >
                                                <ApiTokenTable />
                                            </Timeline.Item>
                                        </Timeline>
                                    </Form>
                                )}
                            </Formik>
                        </ThemedScrollbars>
                        {is_desktop && <ApiTokenArticle />}
                    </div>
                </section>
            </ApiTokenContext.Provider>
        </React.Fragment>
    );
};

export default observer(ApiToken);
