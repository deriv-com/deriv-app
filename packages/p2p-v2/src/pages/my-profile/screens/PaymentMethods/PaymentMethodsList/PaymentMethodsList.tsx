import React, { useEffect, useMemo, useState } from 'react';
import { TAdvertiserPaymentMethods } from 'types';
import { p2p } from '@deriv/api';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { Loader } from '@deriv-com/ui/dist/components/Loader';
import { FullPageMobileWrapper } from '../../../../../components';
import { ConfirmDeletePaymentMethodModal } from '../../../../../components/Modals';
import { PaymentMethodCard } from '../../../../../components/PaymentMethodCard';
import { PAYMENT_METHOD_CATEGORIES } from '../../../../../constants';
import { useDevice } from '../../../../../hooks';
import { useAdvertiserPaymentMethodsConfig, useAdvertiserPaymentMethodsConfigDispatch } from '../../../../../providers';
import { PaymentMethodsEmpty } from '../PaymentMethodsEmpty';
import { PaymentMethodsHeader } from '../PaymentMethodsHeader';
import './PaymentMethodsList.scss';

type TPaymentMethodsGroup = Record<
    string,
    {
        paymentMethods: TAdvertiserPaymentMethods;
        title: string;
    }
>;

type TPaymentMethodsListProps = {
    configFormSate: ReturnType<typeof useAdvertiserPaymentMethodsConfig>['formState'];
};

const PaymentMethodsList = ({ configFormSate }: TPaymentMethodsListProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { isMobile } = useDevice();
    const configDispatch = useAdvertiserPaymentMethodsConfigDispatch();
    const { data: p2pAdvertiserPaymentMethods, isLoading, isRefetching } = p2p.advertiserPaymentMethods.useGet();
    const {
        delete: deleteAdvertiserPaymentMethod,
        error: deleteError,
        isSuccess: isDeleteSuccessful,
    } = p2p.advertiserPaymentMethods.useDelete();

    const { actionType, paymentMethod } = configFormSate || {};

    useEffect(() => {
        if (isDeleteSuccessful) {
            configDispatch({ type: 'RESET' });
        } else if (deleteError) {
            setIsOpen(true);
        }
    }, [isDeleteSuccessful, deleteError, configDispatch]);

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

    if (isLoading) {
        return <Loader />;
    }

    if (!p2pAdvertiserPaymentMethods?.length && !isRefetching) {
        return (
            <PaymentMethodsEmpty
                onAddPaymentMethod={() => {
                    configDispatch({
                        type: 'ADD',
                    });
                }}
            />
        );
    }

    const addNewButton = (
        <Button
            isFullWidth={isMobile}
            onClick={() => {
                configDispatch({
                    type: 'ADD',
                });
            }}
            size='lg'
        >
            Add new {/*  TODO Remember to translate this*/}
        </Button>
    );

    const paymentMethodsListContent = (
        <div className='p2p-v2-payment-methods-list'>
            {isMobile ? null : addNewButton}
            {Object.keys(groupedPaymentMethods)
                ?.sort()
                ?.map(key => {
                    return (
                        <div className='p2p-v2-payment-methods-list__group' key={key}>
                            <div className='p2p-v2-payment-methods-list__group-header'>
                                {groupedPaymentMethods[key].title}
                            </div>
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
                    onComfirm={() => deleteAdvertiserPaymentMethod(Number(paymentMethod?.id))}
                    paymentMethodName={
                        paymentMethod?.fields?.bank_name?.value ??
                        paymentMethod?.fields?.name?.value ??
                        paymentMethod?.display_name
                    }
                />
            )}
        </div>
    );

    if (isMobile) {
        return (
            <FullPageMobileWrapper
                renderFooter={() => addNewButton}
                // TODO: Remember to translate the title
                renderHeader={() => <PaymentMethodsHeader title='Payment methods' />}
            >
                {paymentMethodsListContent}
            </FullPageMobileWrapper>
        );
    }

    return p2pAdvertiserPaymentMethods?.length === 0 ? null : paymentMethodsListContent;
};

export default PaymentMethodsList;
