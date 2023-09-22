import React from 'react';
import { useP2PAdvertiserPaymentMethods } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import PaymentMethodCard from 'Pages/my-profile/payment-methods/payment-method-card';
import { useStores } from 'Stores';
import { TPaymentMethod } from 'Types';
import BuyAdPaymentMethodsList from '../buy-ad-payment-methods-list';
import SellAdPaymentMethodsList from '../sell-ad-payment-methods-list';

type TEditAdFormPaymentMethodsProps = {
    is_sell_advert: boolean;
    setSelectedMethods: (payment_methods: string[]) => void;
    selected_methods: string[];
    touched: (value: boolean) => void;
};

const EditAdFormPaymentMethods = ({
    is_sell_advert,
    selected_methods,
    setSelectedMethods,
    touched,
}: TEditAdFormPaymentMethodsProps) => {
    const { my_ads_store } = useStores();
    const { payment_method_ids, setPaymentMethodIds, setPaymentMethodNames } = my_ads_store;
    const { showModal } = useModalManagerContext();
    const { data: p2p_advertiser_payment_methods } = useP2PAdvertiserPaymentMethods();

    const onClickPaymentMethodCard = (payment_method: TPaymentMethod) => {
        if (!payment_method_ids.includes(payment_method.ID)) {
            if (payment_method_ids.length < 3) {
                payment_method_ids.push(payment_method.ID);
                setSelectedMethods([...selected_methods, payment_method.ID]);
            }
        } else {
            setPaymentMethodIds(
                payment_method_ids.filter((payment_method_id: string) => payment_method_id !== payment_method.ID)
            );
            setSelectedMethods(selected_methods.filter(i => i !== payment_method.ID));
        }
        touched(true);
    };

    React.useEffect(() => {
        return () => {
            setPaymentMethodIds([]);
            setPaymentMethodNames([]);
        };
    }, []);

    if (is_sell_advert) {
        if (p2p_advertiser_payment_methods?.length) {
            return (
                <SellAdPaymentMethodsList
                    selected_methods={selected_methods}
                    onClickAdd={() =>
                        showModal({
                            key: 'CreateAdAddPaymentMethodModal',
                        })
                    }
                    onClickPaymentMethodCard={onClickPaymentMethodCard}
                    p2p_advertiser_payment_methods={p2p_advertiser_payment_methods}
                />
            );
        }

        return (
            <PaymentMethodCard
                is_add
                label={localize('Payment method')}
                medium
                onClickAdd={() =>
                    showModal({
                        key: 'CreateAdAddPaymentMethodModal',
                    })
                }
            />
        );
    }

    return (
        <BuyAdPaymentMethodsList
            selected_methods={selected_methods}
            setSelectedMethods={setSelectedMethods}
            touched={touched}
        />
    );
};

export default observer(EditAdFormPaymentMethods);
