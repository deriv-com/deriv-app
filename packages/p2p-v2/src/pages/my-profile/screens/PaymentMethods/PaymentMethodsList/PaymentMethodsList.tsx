import React, { useMemo } from 'react';
import { TAdvertiserPaymentMethods } from 'types';
import { p2p } from '@deriv/api';
import { PaymentMethodCard } from '../../../../../components/PaymentMethodCard';
import { PAYMENT_METHOD_CATEGORIES } from '../../../../../constants';
import { PaymentMethodsEmpty } from '../PaymentMethodsEmpty';
import './payment-methods-list.scss';

type TPaymentMethodsGroup = Record<
    string,
    {
        paymentMethods: TAdvertiserPaymentMethods;
        title: string;
    }
>;

type TPaymentMethodsListProps = {
    onAddPaymentMethod: () => void;
    onDeletePaymentMethod: (paymentMethodId: number) => void;
    onEditPaymentMethod: (paymentMethod: NonNullable<TAdvertiserPaymentMethods>[number]) => void;
    onGoBack?: () => void;
};

const PaymentMethodsList = ({
    onAddPaymentMethod,
    onDeletePaymentMethod,
    onEditPaymentMethod,
}: TPaymentMethodsListProps) => {
    const { data: p2pAdvertiserPaymentMethods, isLoading, isRefetching } = p2p.advertiserPaymentMethods.useGet();

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
        return <>Show Loader....</>;
    }

    if (!p2pAdvertiserPaymentMethods?.length && !isRefetching) {
        return <PaymentMethodsEmpty onAddPaymentMethod={onAddPaymentMethod} />;
    }

    return p2pAdvertiserPaymentMethods?.length === 0 ? null : (
        <div className='p2p-v2-payment-methodslist-wrapper'>
            <div className='p2p-v2-payment-methods-list'>
                <button className='p2p-v2-payment-methods-list__button' onClick={onAddPaymentMethod}>
                    Add new {/*  TODO Remember to translate this*/}
                </button>

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
                                                key={advertiserPaymentMethod.id}
                                                large
                                                onDeletePaymentMethod={() =>
                                                    onDeletePaymentMethod(Number(advertiserPaymentMethod.id))
                                                }
                                                onEditPaymentMethod={() => onEditPaymentMethod(advertiserPaymentMethod)}
                                                paymentMethod={advertiserPaymentMethod}
                                                shouldShowPaymentMethodDisplayName={false}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default PaymentMethodsList;
