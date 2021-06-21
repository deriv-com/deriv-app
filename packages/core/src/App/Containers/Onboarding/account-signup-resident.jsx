import classNames from 'classnames';
import React from 'react';
import { Button } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import ResidenceForm from '../SetResidenceModal/set-residence-form.jsx';

const AccountSignupResident = ({
    errors,
    touched,
    setFieldTouched,
    setFieldValue,
    country,
    residence_list,
    values,
    onResidenceSelection,
}) => {
    return (
        <ResidenceForm
            class_prefix='account-signup'
            errors={errors}
            touched={touched}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
            residence_list={residence_list}
            default_value={country}
        >
            {!isMobile() && <div className='account-signup__separator' />}
            <Button
                className={classNames('account-signup__btn', {
                    'account-signup__btn--disabled': !values.residence || errors.residence,
                })}
                type='button'
                is_disabled={!values.residence || !!errors.residence}
                onClick={() => {
                    onResidenceSelection(values.residence);
                }}
                primary
                large
                text={localize('Next')}
            />
        </ResidenceForm>
    );
};

export default AccountSignupResident;
