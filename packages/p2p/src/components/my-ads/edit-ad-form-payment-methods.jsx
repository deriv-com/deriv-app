import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import PaymentMethodCard from 'Components/my-profile/payment-methods/payment-method-card';
import { localize } from 'Components/i18next';
import BuyAdPaymentMethodsList from 'Components/my-ads/buy-ad-payment-methods-list.jsx';
import SellAdPaymentMethodsList from 'Components/my-ads/sell-ad-payment-methods-list.jsx';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const EditAdFormPaymentMethods = ({ is_sell_advert, selected_methods, setSelectedMethods, touched }) => {
    const { my_ads_store, my_profile_store } = useStores();
    const { showModal } = useModalManagerContext();

    const onClickPaymentMethodCard = payment_method => {
        if (!my_ads_store.payment_method_ids.includes(payment_method.ID)) {
            if (my_ads_store.payment_method_ids.length < 3) {
                my_ads_store.payment_method_ids.push(payment_method.ID);
                setSelectedMethods([...selected_methods, payment_method.ID]);
            }
        } else {
            my_ads_store.payment_method_ids = my_ads_store.payment_method_ids.filter(
                payment_method_id => payment_method_id !== payment_method.ID
            );
            setSelectedMethods(selected_methods.filter(i => i !== payment_method.ID));
        }
        touched(true);
    };

    React.useEffect(() => {
        return () => {
            my_ads_store.payment_method_ids = [];
            my_ads_store.payment_method_names = [];
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
                is_add={true}
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
