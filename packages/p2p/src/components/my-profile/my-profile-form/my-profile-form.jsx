import * as React from 'react';
import { Field, Form, Formik } from 'formik';
import { Button, DesktopWrapper, Input, Loading, MobileFullPageModal, MobileWrapper, Text } from '@deriv/components';
import { observer, Observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { Localize, localize } from 'Components/i18next';
import FormError from 'Components/form/error.jsx';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores';

const MyProfileForm = () => {
    const { general_store, my_profile_store } = useStores();

    const content = (
        <Formik
            enableReinitialize
            initialValues={{
                contact_info: general_store.contact_info,
                default_advert_description: general_store.default_advert_description,
                payment_info: my_profile_store.payment_info,
            }}
            onSubmit={my_profile_store.handleSubmit}
            validate={my_profile_store.validateForm}
        >
            {({ dirty, errors, isSubmitting, isValid }) => {
                return (
                    <Form className='my-profile-form__form'>
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
                                    initial_character_count={general_store.contact_info.length}
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
                                            <Localize i18n_default_text='Instructions' />
                                        </Text>
                                    }
                                    error={errors.default_advert_description}
                                    hint={localize('This information will be visible to everyone.')}
                                    is_relative_hint
                                    className='my-profile-form__textarea'
                                    has_character_counter
                                    initial_character_count={general_store.default_advert_description.length}
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
    );

    if (my_profile_store.is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <>
            <DesktopWrapper className='my-profile-form'>{content}</DesktopWrapper>
            <MobileWrapper>
                <MobileFullPageModal
                    className='my-profile-form'
                    is_modal_open={my_profile_store.active_tab === my_profile_tabs.AD_TEMPLATE}
                    page_header_text={localize('Ad details')}
                    pageHeaderReturnFn={() => my_profile_store.setActiveTab(my_profile_tabs.MY_STATS)}
                >
                    {content}
                </MobileFullPageModal>
            </MobileWrapper>
        </>
    );
};

export default observer(MyProfileForm);
