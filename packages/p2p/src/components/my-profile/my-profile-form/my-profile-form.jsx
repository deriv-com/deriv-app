import * as React from 'react';
import { Field, Form, Formik } from 'formik';
import { Button, Input, Text } from '@deriv/components';
import { observer, Observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { Localize, localize } from 'Components/i18next';
import FormError from 'Components/form/error.jsx';
import { useStores } from 'Stores';
import MyProfileSeparatorContainer from '../my-profile-separator-container';

const MyProfileForm = () => {
    const { my_profile_store } = useStores();

    return (
        <div className='my-profile-form'>
            <MyProfileSeparatorContainer>
                <Text size='xs' color='prominent' weight='bold'>
                    <Localize i18n_default_text='Ad template' />
                </Text>
                <MyProfileSeparatorContainer.Line has_single_child />
            </MyProfileSeparatorContainer>
            <Formik
                enableReinitialize
                initialValues={{
                    contact_info: my_profile_store.contact_info,
                    default_advert_description: my_profile_store.default_advert_description,
                    payment_info: my_profile_store.payment_info,
                }}
                onSubmit={my_profile_store.handleSubmit}
                validate={my_profile_store.validateForm}
            >
                {({ dirty, errors, isSubmitting, isValid }) => {
                    return (
                        <Form className='my-profile-form__form'>
                            <Field name='payment_info'>
                                {({ field }) => (
                                    <Input
                                        {...field}
                                        type='textarea'
                                        label={
                                            <Text color='less-prominent' size='xs'>
                                                <Localize i18n_default_text='Payment details' />{' '}
                                            </Text>
                                        }
                                        error={errors.payment_info}
                                        hint={localize('e.g. your bank/e-wallet account details')}
                                        is_relative_hint
                                        className='my-profile-form__textarea'
                                        has_character_counter
                                        initial_character_count={my_profile_store.payment_info.length}
                                        max_characters={300}
                                    />
                                )}
                            </Field>
                            <Field name='contact_info'>
                                {({ field }) => (
                                    <Input
                                        {...field}
                                        type='textarea'
                                        label={
                                            <Text color='less-prominent' size='xs'>
                                                <Localize i18n_default_text='Contact details' />
                                            </Text>
                                        }
                                        error={errors.contact_info}
                                        className='my-profile-form__textarea'
                                        has_character_counter
                                        initial_character_count={my_profile_store.contact_info.length}
                                        max_characters={300}
                                    />
                                )}
                            </Field>
                            <Field name='default_advert_description'>
                                {({ field }) => (
                                    <Input
                                        {...field}
                                        type='textarea'
                                        label={
                                            <Text color='less-prominent' size='xs'>
                                                <Localize i18n_default_text='Instructions' />{' '}
                                            </Text>
                                        }
                                        error={errors.default_advert_description}
                                        hint={localize('This information will be visible to everyone.')}
                                        is_relative_hint
                                        className='my-profile-form__textarea'
                                        has_character_counter
                                        initial_character_count={my_profile_store.default_advert_description.length}
                                        max_characters={300}
                                    />
                                )}
                            </Field>
                            <div className='my-profile-form__footer'>
                                <FormError message={my_profile_store.form_error} />
                                <Observer>
                                    {() => (
                                        <Button
                                            className={classNames('my-profile-form__footer-button', {
                                                'dc-btn--green': my_profile_store.is_submit_success,
                                            })}
                                            is_disabled={!dirty || isSubmitting || !isValid}
                                            is_submit_success={my_profile_store.is_submit_success}
                                            text={localize('Save')}
                                            has_effect
                                            primary
                                            large
                                        />
                                    )}
                                </Observer>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

export default observer(MyProfileForm);
