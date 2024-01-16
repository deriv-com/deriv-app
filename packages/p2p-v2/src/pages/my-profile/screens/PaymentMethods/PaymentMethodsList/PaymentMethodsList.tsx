import React, { useMemo } from 'react';
import { TAdvertiserPaymentMethods } from 'types';
import { p2p } from '@deriv/api';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { FullPageMobileWrapper } from '../../../../../components';
import { PaymentMethodCard } from '../../../../../components/PaymentMethodCard';
import { PAYMENT_METHOD_CATEGORIES } from '../../../../../constants';
import { useDevice } from '../../../../../hooks';
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
    onAddPaymentMethod: () => void;
    onDeletePaymentMethod: (paymentMethodId: number) => void;
    onEditPaymentMethod: (paymentMethod: NonNullable<TAdvertiserPaymentMethods>[number]) => void;
};

const PaymentMethodsList = ({
    onAddPaymentMethod,
    onDeletePaymentMethod,
    onEditPaymentMethod,
}: TPaymentMethodsListProps) => {
    const { isMobile } = useDevice();

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

    // TODO: Add loader when available
    if (isLoading) {
        return <>Show Loader....</>;
    }

    if (!p2pAdvertiserPaymentMethods?.length && !isRefetching) {
        return <PaymentMethodsEmpty onAddPaymentMethod={onAddPaymentMethod} />;
    }

    const addNewButton = (
        <Button isFullWidth={isMobile} onClick={onAddPaymentMethod} size='lg'>
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
