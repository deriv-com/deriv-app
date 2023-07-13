import React from 'react';
import { observer } from '@deriv/stores';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import PaymentMethodCard from 'Pages/my-profile/payment-methods/payment-method-card';
import { useStores } from 'Stores';
import BuyAdPaymentMethodsList from '../buy-ad-payment-methods-list';
import SellAdPaymentMethodsList from '../sell-ad-payment-methods-list';
import { TPaymentMethod } from 'Types';

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
    const { my_ads_store, my_profile_store } = useStores();
    const { payment_method_ids, setPaymentMethodIds, setPaymentMethodNames } = my_ads_store;
    const { showModal } = useModalManagerContext();

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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (is_sell_advert) {
        if (my_profile_store.advertiser_has_payment_methods) {
            return (
                <SellAdPaymentMethodsList
                    selected_methods={selected_methods}
                    onClickAdd={() =>
                        showModal({
                            key: 'CreateAdAddPaymentMethodModal',
                        })
                    }
                    onClickPaymentMethodCard={onClickPaymentMethodCard}
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
