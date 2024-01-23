import React, { useEffect, useMemo, useState } from 'react';
import { TAdvertiserPaymentMethods } from 'types';
import { p2p } from '@deriv/api';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { ConfirmDeletePaymentMethodModal } from '../../../../../components/Modals';
import { PaymentMethodCard } from '../../../../../components/PaymentMethodCard';
import { PAYMENT_METHOD_CATEGORIES } from '../../../../../constants';
import { useAdvertiserPaymentMethodsConfig, useAdvertiserPaymentMethodsConfigDispatch } from '../../../../../providers';
import AddNewButton from './AddNewButton';

type TPaymentMethodsGroup = Record<
    string,
    {
        paymentMethods: TAdvertiserPaymentMethods;
        title: string;
    }
>;

type TPaymentMethodsListContentProps = {
    configFormState: ReturnType<typeof useAdvertiserPaymentMethodsConfig>['formState'];
    isMobile: boolean;
    p2pAdvertiserPaymentMethods: TAdvertiserPaymentMethods;
};

const PaymentMethodsListContent = ({
    configFormState,
    isMobile,
    p2pAdvertiserPaymentMethods,
}: TPaymentMethodsListContentProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const configDispatch = useAdvertiserPaymentMethodsConfigDispatch();
    const {
        delete: deleteAdvertiserPaymentMethod,
        error: deleteError,
        isSuccess: isDeleteSuccessful,
    } = p2p.advertiserPaymentMethods.useDelete();

    const { actionType, paymentMethod } = configFormState || {};
    const groupedPaymentMethods = useMemo(() => {
        const groups: TPaymentMethodsGroup = {};
        p2pAdvertiserPaymentMethods?.forEach(advertiserPaymentMethod => {
            if (groups[advertiserPaymentMethod.type]) {
                groups[advertiserPaymentMethod.type]?.paymentMethods?.push(advertiserPaymentMethod);
            } else {
                groups[advertiserPaymentMethod.type] = {
                    paymentMethods: [advertiserPaymentMethod],
                    title: PAYMENT_METHOD_CATEGORIES[advertiserPaymentMethod.type],
                };
            }
        });
        return groups;
    }, [p2pAdvertiserPaymentMethods]);

    useEffect(() => {
        if (isDeleteSuccessful) {
            configDispatch({ type: 'RESET' });
        } else if (deleteError) {
            setIsOpen(true);
        }
    }, [isDeleteSuccessful, deleteError, configDispatch]);

    return (
        <div className='p2p-v2-payment-methods-list'>
            {isMobile ? null : (
                <AddNewButton
                    isMobile={isMobile}
                    onAdd={() => {
                        configDispatch({
                            type: 'ADD',
                        });
                    }}
                />
            )}
            {Object.keys(groupedPaymentMethods)
                ?.sort()
                ?.map(key => {
                    return (
                        <div className='p2p-v2-payment-methods-list__group' key={key}>
                            <Text color='black' weight='bold'>
                                {groupedPaymentMethods[key].title}
                            </Text>
                            <div className='p2p-v2-payment-methods-list__group-body'>
                                {groupedPaymentMethods[key].paymentMethods?.map(advertiserPaymentMethod => {
                                    return (
                                        <PaymentMethodCard
                                            isEditable
                                            key={advertiserPaymentMethod.id}
                                            onDeletePaymentMethod={() => {
                                                configDispatch({
                                                    payload: { paymentMethod: advertiserPaymentMethod },
                                                    type: 'DELETE',
                                                });
                                                setIsOpen(true);
                                            }}
                                            onEditPaymentMethod={() => {
                                                configDispatch({
                                                    payload: {
                                                        paymentMethod: {
                                                            displayName: advertiserPaymentMethod.display_name,
                                                            fields: advertiserPaymentMethod.fields,
                                                            id: advertiserPaymentMethod.id,
                                                            method: advertiserPaymentMethod.method,
                                                        },
                                                    },
                                                    type: 'EDIT',
                                                });
                                            }}
                                            paymentMethod={advertiserPaymentMethod}
                                            shouldShowPaymentMethodDisplayName={false}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            {actionType === 'DELETE' && (
                <ConfirmDeletePaymentMethodModal
                    isOpen={isOpen}
                    onCancel={() => setIsOpen(false)}
                    onConfirm={() => deleteAdvertiserPaymentMethod(Number(paymentMethod?.id))}
                    paymentMethodName={
                        paymentMethod?.fields?.bank_name?.value ??
                        paymentMethod?.fields?.name?.value ??
                        paymentMethod?.display_name
                    }
                />
            )}
        </div>
    );
};

export default PaymentMethodsListContent;
