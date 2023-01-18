import { Button, Input, Timeline } from '@deriv/components';
import { localize } from '@deriv/translations';
import classNames from 'classnames';
import { Field, FieldProps, Form, Formik, FormikErrors, FormikHelpers } from 'formik';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IFormValues } from 'Types';
import useApiToken from '../hooks/use-api-token';
import ApiTokenCard from './api-token-card';
import InlineNoteWithIcon from '../../inline-note-with-icon';
import { APITokenResponse } from '@deriv/api-types';
import { getPropertyValue } from '@deriv/shared';

const MIN_TOKEN = 2;
const MAX_TOKEN = 32;

const initial_values: IFormValues = {
    token_name: '',
    read: false,
    trade: false,
    payments: false,
    trading_information: false,
    admin: false,
};

const validateFields = (values: IFormValues) => {
    const errors: FormikErrors<IFormValues> = {};
    const token_name = values.token_name && values.token_name.trim();

    if (!token_name) {
        errors.token_name = localize('Please enter a token name.');
    } else if (!/^[A-Za-z0-9\s_]+$/g.test(token_name)) {
        errors.token_name = localize('Only letters, numbers, and underscores are allowed.');
    } else if (token_name.length < MIN_TOKEN) {
        errors.token_name = localize(
            'Length of token name must be between {{MIN_TOKEN}} and {{MAX_TOKEN}} characters.',
            {
                MIN_TOKEN,
                MAX_TOKEN,
            }
        );
    } else if (token_name.length > MAX_TOKEN) {
        errors.token_name = localize('Maximum {{MAX_TOKEN}} characters.', { MAX_TOKEN });
    }

    return errors;
};
const selectedTokenScope = (values: IFormValues) =>
    Object.keys(values).filter(item => item !== 'token_name' && values[item]);

const ApiTokenForm = () => {
    const [success, setSuccess] = useState(false);
    const timeout_ref = useRef<NodeJS.Timeout>();
    const { requestAddToken } = useApiToken();

    const onSubmit = useCallback(
        (values: IFormValues, helpers: FormikHelpers<IFormValues>) => {
            const onFinishedAdd = (response: APITokenResponse) => {
                if (response.error) {
                    helpers.setFieldError('token_name', getPropertyValue(response, ['error', 'message']));
                } else {
                    helpers.resetForm();
                    helpers.setSubmitting(false);
                }
            };

            setSuccess(true);
            requestAddToken(values, onFinishedAdd);
            timeout_ref.current = setTimeout(() => {
                setSuccess(false);
            }, 500);
        },
        [requestAddToken]
    );

    useEffect(() => {
        return () => {
            clearTimeout(timeout_ref.current);
        };
    }, []);

    return (
        <Formik initialValues={initial_values} onSubmit={onSubmit} validate={validateFields}>
            {({
                values,
                errors,
                isValid,
                dirty,
                touched,
                handleChange,
                handleBlur,
                isSubmitting,
                setFieldValue,
                setFieldTouched,
            }) => (
                <Form noValidate>
                    <Timeline className='da-api-token__timeline' line_height='xxxl'>
                        <Timeline.Item item_title={localize('Select scopes based on the access you need.')}>
                            <div className='da-api-token__checkbox-wrapper'>
                                <ApiTokenCard
                                    name='read'
                                    value={values.read}
                                    setFieldValue={setFieldValue}
                                    display_name={localize('Read')}
                                    description={localize(
                                        'This scope will allow third-party apps to view your account activity, settings, limits, balance sheets, trade purchase history, and more.'
                                    )}
                                />
                                <ApiTokenCard
                                    name='trade'
                                    value={values.trade}
                                    display_name={localize('Trade')}
                                    setFieldValue={setFieldValue}
                                    description={localize(
                                        'This scope will allow third-party apps to buy and sell contracts for you, renew your expired purchases, and top up your demo accounts.'
                                    )}
                                />
                                <ApiTokenCard
                                    name='payments'
                                    value={values.payments}
                                    display_name={localize('Payments')}
                                    setFieldValue={setFieldValue}
                                    description={localize(
                                        'This scope will allow third-party apps to withdraw to payment agents and make inter-account transfers for you.'
                                    )}
                                />
                                <ApiTokenCard
                                    name='trading_information'
                                    value={values.trading_information}
                                    display_name={localize('Trading information')}
                                    setFieldValue={setFieldValue}
                                    description={localize(
                                        'This scope will allow third-party apps to view your trading history.'
                                    )}
                                />
                                <ApiTokenCard
                                    name='admin'
                                    value={values.admin}
                                    display_name={localize('Admin')}
                                    setFieldValue={setFieldValue}
                                    description={localize(
                                        'This scope will allow third-party apps to open accounts for you, manage your settings and token usage, and more. '
                                    )}
                                >
                                    <InlineNoteWithIcon
                                        icon='IcAlertWarning'
                                        message={localize(
                                            'To avoid loss of funds, do not share tokens with the Admin scope with unauthorised parties.'
                                        )}
                                        title={localize('Note')}
                                    />
                                </ApiTokenCard>
                            </div>
                        </Timeline.Item>
                        <Timeline.Item
                            item_title={localize("Name your token and click on 'Create' to generate your token.")}
                        >
                            <div className='da-api-token__input-group'>
                                <Field name='token_name'>
                                    {({ field }: FieldProps<string | boolean>) => (
                                        <Input
                                            {...field}
                                            data-lpignore='true'
                                            type='text'
                                            className='da-api-token__input dc-input__input-group'
                                            label={localize('Token name')}
                                            value={values.token_name}
                                            onChange={e => {
                                                setFieldTouched('token_name', true);
                                                handleChange(e);
                                            }}
                                            onBlur={handleBlur}
                                            hint={localize('Length of token name must be between 2 and 32 characters.')}
                                            required
                                            error={
                                                touched?.token_name && errors?.token_name
                                                    ? errors?.token_name
                                                    : undefined
                                            }
                                        />
                                    )}
                                </Field>
                                <Button
                                    className={classNames('dc-btn__button-group', 'da-api-token__button', {
                                        'da-api-token__button--success': success,
                                    })}
                                    type='submit'
                                    is_disabled={
                                        !dirty || isSubmitting || !isValid || !selectedTokenScope(values).length
                                    }
                                    has_effect
                                    is_loading={isSubmitting}
                                    is_submit_success={success}
                                    text={localize('Create')}
                                    primary
                                    large
                                />
                            </div>
                        </Timeline.Item>
                        <Timeline.Item item_title={localize('Copy and paste the token into the app.')} />
                    </Timeline>
                </Form>
            )}
        </Formik>
    );
};

export default ApiTokenForm;
