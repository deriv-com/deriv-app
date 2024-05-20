import React from 'react';
import { Formik } from 'formik';
import { localize, Localize } from '@deriv/translations';
import { getPasskeyRenameValidationSchema } from '../passkeys-configs';
import { PasskeysStatusLayout, TPasskeysButtonOnClicks } from './passkeys-status-layout';
import FormInputField from '../../../../Components/forms/form-fields/form-input-field';

// TODO: check the props for renaming
type TPasskeyRename = { id?: number; passkey_name?: string } & TPasskeysButtonOnClicks;

type TInitialValues = { passkey_rename: string };

export const PasskeyRename = ({ onPrimaryButtonClick, onSecondaryButtonClick, passkey_name = '' }: TPasskeyRename) => {
    const form_initial_values: TInitialValues = {
        passkey_rename: passkey_name,
    };

    // TODO: add api call for renaming passkey

    const onSubmitValues = () => {
        onPrimaryButtonClick();
    };

    return (
        <Formik
            initialValues={form_initial_values}
            onSubmit={onSubmitValues}
            validationSchema={getPasskeyRenameValidationSchema()}
        >
            {({ dirty, isValid }) => (
                <div className='passkeys'>
                    <PasskeysStatusLayout
                        icon='IcEditPasskey'
                        title={<Localize i18n_default_text='Edit passkey' />}
                        onPrimaryButtonClick={onPrimaryButtonClick}
                        onSecondaryButtonClick={onSecondaryButtonClick}
                        primary_button_text={<Localize i18n_default_text='Save changes' />}
                        secondary_button_text={<Localize i18n_default_text='Back' />}
                        primary_button_disabled={!dirty || !isValid}
                    >
                        <FormInputField label={localize('Passkey rename')} name='passkey_rename' />
                    </PasskeysStatusLayout>
                </div>
            )}
        </Formik>
    );
};
