import React from 'react';
import { Form, Formik } from 'formik';
import { localize, Localize } from '@deriv/translations';
import { DerivLightIcEditPasskeyIcon } from '@deriv/quill-icons';
import { TCurrentManagedPasskey } from '../passkeys';
import { getPasskeyRenameValidationSchema } from '../passkeys-configs';
import { PasskeysStatusLayout, TPasskeysButtonOnClicks } from './passkeys-status-layout';
import FormInputField from '../../../../Components/forms/form-fields/form-input-field';

type TPasskeyRename = { current_managed_passkey: TCurrentManagedPasskey } & TPasskeysButtonOnClicks;

type TInitialValues = { passkey_rename: string };

export const PasskeyRename = ({
    onPrimaryButtonClick,
    onSecondaryButtonClick,
    current_managed_passkey,
}: TPasskeyRename) => {
    const form_initial_values: TInitialValues = {
        passkey_rename: current_managed_passkey.name,
    };

    const onSubmitValues = (values: TInitialValues) => {
        onPrimaryButtonClick({ name: values.passkey_rename });
    };

    return (
        <Formik
            initialValues={form_initial_values}
            onSubmit={onSubmitValues}
            validationSchema={getPasskeyRenameValidationSchema()}
        >
            {({ dirty, isValid, values }) => (
                <div className='passkeys'>
                    <Form>
                        <PasskeysStatusLayout
                            icon={<DerivLightIcEditPasskeyIcon height='96px' width='96px' />}
                            title={<Localize i18n_default_text='Edit passkey' />}
                            onPrimaryButtonClick={onPrimaryButtonClick}
                            onSecondaryButtonClick={onSecondaryButtonClick}
                            primary_button_text={<Localize i18n_default_text='Save changes' />}
                            secondary_button_text={<Localize i18n_default_text='Back' />}
                            primary_button_disabled={!dirty || !isValid}
                            primary_button_type='submit'
                        >
                            <FormInputField autoFocus label={localize('Passkey rename')} name='passkey_rename' />
                        </PasskeysStatusLayout>
                    </Form>
                </div>
            )}
        </Formik>
    );
};
