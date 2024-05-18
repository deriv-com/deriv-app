import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { localize, Localize } from '@deriv/translations';
import { PasskeysStatusLayout, TPasskeysButtonOnClicks } from './passkeys-status-layout';
import FormInputField from '../../../../Components/forms/form-fields/form-input-field';

type TPasskeyRename = { id?: number } & TPasskeysButtonOnClicks;

export const PasskeyRename = ({ onPrimaryButtonClick, onSecondaryButtonClick }: TPasskeyRename) => {
    const form_initial_values = {
        passkey_rename: 'old name',
    };

    const passkey_rename_validation_schema = Yup.object().shape({
        passkey_rename: Yup.string()
            .min(3, localize('Only 3-30 characters allowed.'))
            .max(30, localize('Only 3-30 characters allowed.'))
            .matches(/^[A-Za-z0-9][A-Za-z0-9\s-]*$/, localize('Only letters, numbers, space, and hyphen are allowed.')),
    });

    const onSubmitValues = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        //TODO: refactor types
        onPrimaryButtonClick(e);
    };

    return (
        <Formik
            initialValues={form_initial_values}
            onSubmit={onSubmitValues}
            validationSchema={passkey_rename_validation_schema}
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
                        <FormInputField
                            initial_character_count={form_initial_values.passkey_rename.length}
                            label={localize('Passkey rename')}
                            name='passkey_rename'
                        />
                    </PasskeysStatusLayout>
                </div>
            )}
        </Formik>
    );
};
