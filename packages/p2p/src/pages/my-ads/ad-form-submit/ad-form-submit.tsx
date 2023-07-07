import React from 'react';
import { useFormikContext } from 'formik';
import { Button } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { ads } from 'Constants/ads';
import { TPaymentMethodField } from 'Types';

type TAdFormSubmitProps = {
    ad_option: string;
    check_dirty?: boolean;
    current_method: {
        key: string;
        is_deleted: boolean;
    };
    handleEditAdFormCancel?: (dirty: boolean) => void;
    onCleanup?: () => void;
    payment_method_names?: string[];
    payment_method_details?: {
        [key: string]: {
            display_name: string;
            is_enabled: number;
            method: string;
            type: string;
            used_by_adverts: null | string[];
            used_by_orders: null | string[];
            fields: {
                account: TPaymentMethodField;
                instructions: TPaymentMethodField;
            };
        };
    };
    selected_methods: string[];
};

const AdFormSubmit = ({
    ad_option,
    check_dirty,
    current_method,
    handleEditAdFormCancel = () => {
        // do nothing
    },
    onCleanup = () => {
        // do nothing
    },
    payment_method_details,
    payment_method_names,
    selected_methods,
}: TAdFormSubmitProps) => {
    const { dirty, isSubmitting, isValid } = useFormikContext();
    const check_button = isSubmitting || !isValid || selected_methods.length === 0 || current_method.is_deleted;
    const is_button_disabled =
        ad_option === ads.CREATE
            ? check_button
            : check_button || !check_dirty || !(!!payment_method_names || !!payment_method_details);
    return (
        <div className='ad-form-submit'>
            <Button
                className='ad-form-submit__button'
                secondary
                large
                onClick={ad_option === ads.CREATE ? () => onCleanup() : () => handleEditAdFormCancel(dirty)}
                type='button'
            >
                <Localize i18n_default_text='Cancel' />
            </Button>
            <Button className='ad-form-submit__button' has_effect primary large is_disabled={is_button_disabled}>
                {ad_option === ads.CREATE ? (
                    <Localize i18n_default_text='Post ad' />
                ) : (
                    <Localize i18n_default_text='Save changes' />
                )}
            </Button>
        </div>
    );
};

export default AdFormSubmit;
