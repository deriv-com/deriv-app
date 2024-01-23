import React from 'react';
import { p2p } from '@deriv/api';
import { Loader } from '@deriv-com/ui/dist/components/Loader';
import { FullPageMobileWrapper } from '../../../../../components';
import { useDevice } from '../../../../../hooks';
import { useAdvertiserPaymentMethodsConfig, useAdvertiserPaymentMethodsConfigDispatch } from '../../../../../providers';
import { PaymentMethodsEmpty } from '../PaymentMethodsEmpty';
import { PaymentMethodsHeader } from '../PaymentMethodsHeader';
import AddNewButton from './AddNewButton';
import PaymentMethodsListContent from './PaymentMethodsContent';
import './PaymentMethodsList.scss';

type TPaymentMethodsListProps = {
    configFormState: ReturnType<typeof useAdvertiserPaymentMethodsConfig>['formState'];
};

const PaymentMethodsList = ({ configFormState }: TPaymentMethodsListProps) => {
    const { isMobile } = useDevice();
    const configDispatch = useAdvertiserPaymentMethodsConfigDispatch();
    const { data: p2pAdvertiserPaymentMethods, isLoading, isRefetching } = p2p.advertiserPaymentMethods.useGet();

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

    if (isMobile) {
        return (
            <FullPageMobileWrapper
                renderFooter={() => (
                    <AddNewButton
                        isMobile={isMobile}
                        onAdd={() => {
                            configDispatch({
                                type: 'ADD',
                            });
                        }}
                    />
                )}
                // TODO: Remember to translate the title
                renderHeader={() => <PaymentMethodsHeader title='Payment methods' />}
            >
                <PaymentMethodsListContent
                    configFormState={configFormState}
                    isMobile={isMobile}
                    p2pAdvertiserPaymentMethods={p2pAdvertiserPaymentMethods}
                />
            </FullPageMobileWrapper>
        );
    }

    return p2pAdvertiserPaymentMethods?.length === 0 ? null : (
        <PaymentMethodsListContent
            configFormState={configFormState}
            isMobile={isMobile}
            p2pAdvertiserPaymentMethods={p2pAdvertiserPaymentMethods}
        />
    );
};

export default PaymentMethodsList;
