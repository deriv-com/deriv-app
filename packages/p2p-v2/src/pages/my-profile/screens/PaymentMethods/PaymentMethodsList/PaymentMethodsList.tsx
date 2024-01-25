import React from 'react';
import { p2p } from '@deriv/api';
import { Loader } from '@deriv-com/ui/dist/components/Loader';
import { FullPageMobileWrapper } from '../../../../../components';
import { PaymentMethodsHeader } from '../../../../../components/PaymentMethodsHeader';
import { useDevice } from '../../../../../hooks';
import { useAdvertiserPaymentMethodsConfig, useAdvertiserPaymentMethodsConfigDispatch } from '../../../../../providers';
import { PaymentMethodsEmpty } from '../PaymentMethodsEmpty';
import AddNewButton from './AddNewButton';
import PaymentMethodsListContent from './PaymentMethodsListContent';
import './PaymentMethodsList.scss';

type TPaymentMethodsListProps = {
    configFormState: ReturnType<typeof useAdvertiserPaymentMethodsConfig>['formState'];
};

/**
 * @component This component is used to display the list of payment methods if they exist, otherwise it will display the empty state
 * @param configFormState - The form state of the payment method form
 * @returns {JSX.Element}
 * @example <PaymentMethodsList configFormState={configFormState} />
 * **/
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
