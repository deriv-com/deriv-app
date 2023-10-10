import React from 'react';
import { Formik } from 'formik';
import { FormSubmitButton, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';

type TypeCFDPasswordError = {
    closeModal: () => void;
    has_cancel_button: boolean;
    cancel_button_label: string | null;
    handleCancel: () => void;
    button_label: string;
};

const CFDPasswordError = observer(
    ({ closeModal, has_cancel_button, cancel_button_label, handleCancel, button_label }: TypeCFDPasswordError) => {
        const { ui: is_mobile } = useStore();

        return (
            <div className='cfd-password-reset'>
                <div className='cfd-password-modal__content cfd-password-modal__content--password-reset'>
                    <Text as='p' line_height='24' size='xs'>
                        <Localize i18n_default_text='Please try again in a minute.' />
                    </Text>
                </div>
                <Formik onSubmit={closeModal} initialValues={{}}>
                    {({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <FormSubmitButton
                                has_cancel={has_cancel_button}
                                cancel_label={cancel_button_label}
                                onCancel={handleCancel}
                                is_absolute={is_mobile}
                                label={button_label}
                            />
                        </form>
                    )}
                </Formik>
            </div>
        );
    }
);

export default CFDPasswordError;
