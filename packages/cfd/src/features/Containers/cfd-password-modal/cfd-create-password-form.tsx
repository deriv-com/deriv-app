import React from 'react';
import { TCFDPasswordFormReusedProps, TCFDPasswordFormValues, TOnSubmitPassword } from './types';
import ChangePasswordConfirmation from 'Containers/cfd-change-password-confirmation';
import { CreatePassword } from './create-password';
import { CFD_PLATFORMS } from 'Helpers/cfd-config';

import { FormikHelpers } from 'formik';
import { MultiStep } from '@deriv/components';

type TCFDCreatePasswordFormProps = TCFDPasswordFormReusedProps & {
    has_mt5_account: boolean;
    submitPassword: TOnSubmitPassword;
    is_real_financial_stp: boolean;
};

type TMultiStepRefProps = {
    goNextStep: () => void;
    goPrevStep: () => void;
};

export const CFDCreatePasswordForm = ({
    has_mt5_account,
    platform,
    error_message,
    validatePassword,
    submitPassword,
    is_real_financial_stp,
}: TCFDCreatePasswordFormProps) => {
    const multi_step_ref = React.useRef<TMultiStepRefProps>();
    const [password, setPassword] = React.useState('');

    const onSubmit: TOnSubmitPassword = (values, actions) => {
        if (platform === CFD_PLATFORMS.MT5 && has_mt5_account) {
            setPassword(values.password);
            multi_step_ref.current?.goNextStep();
        } else {
            submitPassword(values, actions);
        }
    };

    const steps = [
        {
            component: (
                <CreatePassword
                    password={password}
                    platform={platform}
                    error_message={error_message}
                    validatePassword={validatePassword}
                    onSubmit={onSubmit}
                    is_real_financial_stp={is_real_financial_stp}
                />
            ),
        },
        {
            component: (
                <ChangePasswordConfirmation
                    className='cfd-password-modal__change-password-confirmation'
                    platform={platform}
                    onConfirm={(_values: TCFDPasswordFormValues, actions: FormikHelpers<TCFDPasswordFormValues>) =>
                        submitPassword({ password }, actions)
                    }
                    onCancel={() => multi_step_ref.current?.goPrevStep()}
                />
            ),
        },
    ];

    return <MultiStep ref={multi_step_ref} steps={steps} />;
};
