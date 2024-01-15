import React, { useEffect, useState } from 'react';
import {
    TAdvertiserPaymentMethods,
    TPaymentMethodFormConfig,
    TPaymentMethodFotmValues,
    TSelectedPaymentMethod,
} from 'types';
import { p2p } from '@deriv/api';
import { PaymentMethodForm } from './PaymentMethodForm';
import { PaymentMethodsList } from './PaymentMethodsList';

const PaymentMethods = () => {
    const [paymentMethodFormConfig, setPaymentMethodFormConfig] = useState<TPaymentMethodFormConfig | null>(null);
    const { create, error: createError, isSuccess: isCreateSuccessful } = p2p.advertiserPaymentMethods.useCreate();
    const { error: updateError, isSuccess: isUpdateSuccessful, update } = p2p.advertiserPaymentMethods.useUpdate();
    const {
        delete: deleteAdvertiserPaymentMethod,
        error: deleteError,
        isSuccess: isDeleteSuccessful,
    } = p2p.advertiserPaymentMethods.useDelete();

    useEffect(() => {
        if (isCreateSuccessful) {
            setPaymentMethodFormConfig(null);
        } else if (createError) {
            // TODO: Remember to wire up the modal to show error message
        }
    }, [isCreateSuccessful, createError]);

    useEffect(() => {
        if (isUpdateSuccessful) {
            setPaymentMethodFormConfig(null);
        } else if (updateError) {
            // TODO: Remember to wire up the modal to show error message
        }
    }, [isUpdateSuccessful, updateError]);

    useEffect(() => {
        if (isDeleteSuccessful) {
            // TODO: Remember to hide the modal
        } else if (deleteError) {
            // TODO: Remember to wire up the modal to show error message
        }
    }, [isDeleteSuccessful, deleteError]);

    const handleAddPaymentMethod = () => {
        setPaymentMethodFormConfig({
            isVisible: true,
            title: 'Add payment method',
            type: 'ADD',
        });
    };

    const handleEditPaymentMethod = (paymentMethod: NonNullable<TAdvertiserPaymentMethods>[number]) => {
        setPaymentMethodFormConfig({
            isVisible: true,
            paymentMethod,
            title: 'Edit payment method',
            type: 'EDIT',
        });
    };

    const handleDeletePaymentMethod = (paymentMethodId: number) => {
        // TODO: Remember to wire up the modal
        deleteAdvertiserPaymentMethod(paymentMethodId);
    };
    const handleSelectPaymentMethod = (paymentMethod: TSelectedPaymentMethod) => {
        if (paymentMethodFormConfig) {
            setPaymentMethodFormConfig({
                ...paymentMethodFormConfig,
                paymentMethod: {
                    display_name: paymentMethod.displayName,
                    fields: paymentMethod.fields,
                    method: paymentMethod.method,
                },
            });
        }
    };
    const handleFormSubmit = ({ paymentMethodId, type, values }: TPaymentMethodFotmValues) => {
        if (type === 'ADD') {
            create(values);
        } else if (type === 'EDIT') {
            update(paymentMethodId, values);
        }
    };

    const handleGoBack = () => {
        setPaymentMethodFormConfig(null);
    };

    if (paymentMethodFormConfig?.isVisible) {
        return (
            <PaymentMethodForm
                onClear={handleAddPaymentMethod}
                onFormSubmit={handleFormSubmit}
                onGoBack={handleGoBack}
                onSelectPaymentMethod={handleSelectPaymentMethod}
                paymentMethodFormConfig={paymentMethodFormConfig}
            />
        );
    }

    return (
        <PaymentMethodsList
            onAddPaymentMethod={handleAddPaymentMethod}
            onDeletePaymentMethod={handleDeletePaymentMethod}
            onEditPaymentMethod={handleEditPaymentMethod}
        />
    );
};

export default PaymentMethods;
