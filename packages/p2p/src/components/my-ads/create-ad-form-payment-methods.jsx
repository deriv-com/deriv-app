import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import PaymentMethodCard from '../my-profile/payment-methods/payment-method-card';
import { localize } from 'Components/i18next';
import BuyAdPaymentMethodsList from './buy-ad-payment-methods-list';

const CreateAdFormPaymentMethods = ({ is_sell_advert, onSelectPaymentMethods }) => {
    const { my_ads_store, my_profile_store } = useStores();
    const [selected_buy_methods, setSelectedBuyMethods] = React.useState([]);
    const [selected_sell_methods, setSelectedSellMethods] = React.useState([]);

    const style = {
        borderColor: 'var(--brand-secondary)',
        borderWidth: '2px',
    };

    const onClickPaymentMethodCard = payment_method => {
        if (!my_ads_store.payment_method_ids.includes(payment_method.ID)) {
            if (my_ads_store.payment_method_ids.length < 3) {
                my_ads_store.payment_method_ids.push(payment_method.ID);
                setSelectedSellMethods([...selected_sell_methods, payment_method.ID]);
            }
        } else {
            my_ads_store.payment_method_ids = my_ads_store.payment_method_ids.filter(
                payment_method_id => payment_method_id !== payment_method.ID
            );
            setSelectedSellMethods(selected_sell_methods.filter(i => i !== payment_method.ID));
        }
    };

    React.useEffect(() => {
        return () => {
            my_ads_store.payment_method_ids = [];
            my_ads_store.payment_method_names = [];
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (is_sell_advert) {
            onSelectPaymentMethods(selected_sell_methods);
        } else {
            onSelectPaymentMethods(selected_buy_methods);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected_buy_methods, selected_sell_methods]);

    if (is_sell_advert) {
        if (my_profile_store.advertiser_has_payment_methods) {
            return (
                <>
                    {my_profile_store.advertiser_payment_methods_list.map((payment_method, key) => (
                        <PaymentMethodCard
                            is_vertical_ellipsis_visible={false}
                            key={key}
                            medium
                            onClick={() => onClickPaymentMethodCard(payment_method)}
                            payment_method={payment_method}
                            style={selected_sell_methods.includes(payment_method.ID) ? style : {}}
                        />
                    ))}
                    <PaymentMethodCard
                        is_add={true}
                        label={localize('Payment method')}
                        medium
                        onClickAdd={() => my_ads_store.setShouldShowAddPaymentMethodModal(true)}
                    />
                </>
            );
        }

        return (
            <PaymentMethodCard
                is_add={true}
                label={localize('Payment method')}
                medium
                onClickAdd={() => my_ads_store.setShouldShowAddPaymentMethodModal(true)}
            />
        );
    }

    return (
        <BuyAdPaymentMethodsList selected_methods={selected_buy_methods} setSelectedMethods={setSelectedBuyMethods} />
    );
};

export default observer(CreateAdFormPaymentMethods);
