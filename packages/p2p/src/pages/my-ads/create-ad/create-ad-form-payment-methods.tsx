import React from 'react';
import { useP2PAdvertiserPaymentMethods } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import PaymentMethodCard from 'Pages/my-profile/payment-methods/payment-method-card';
import { TPaymentMethod } from 'Types';
import BuyAdPaymentMethodsList from '../buy-ad-payment-methods-list';
import SellAdPaymentMethodsList from '../sell-ad-payment-methods-list';

type TCreateAdFormPaymentMethodsProps = {
    is_sell_advert: boolean;
    onSelectPaymentMethods: (payment_methods: string[]) => void;
};

const CreateAdFormPaymentMethods = ({ is_sell_advert, onSelectPaymentMethods }: TCreateAdFormPaymentMethodsProps) => {
    const { my_ads_store, my_profile_store } = useStores();
    const { data: p2p_advertiser_payment_methods } = useP2PAdvertiserPaymentMethods();
    const { payment_method_ids, setPaymentMethodIds, setPaymentMethodNames } = my_ads_store;
    const [selected_buy_methods, setSelectedBuyMethods] = React.useState<string[]>([]);
    const [selected_sell_methods, setSelectedSellMethods] = React.useState<string[]>([]);
    const { showModal } = useModalManagerContext();

    const onClickPaymentMethodCard = (payment_method: TPaymentMethod) => {
        if (!payment_method_ids.includes(payment_method.ID)) {
            if (payment_method_ids.length < 3) {
                payment_method_ids.push(payment_method.ID);
                setSelectedSellMethods([...selected_sell_methods, payment_method.ID]);
            }
        } else {
            setPaymentMethodIds(
                payment_method_ids.filter((payment_method_id: string) => payment_method_id !== payment_method.ID)
            );
            setSelectedSellMethods(selected_sell_methods.filter(i => i !== payment_method.ID));
        }
    };

    React.useEffect(() => {
        return () => {
            setPaymentMethodIds([]);
            setPaymentMethodNames([]);
        };
    }, []);

    React.useEffect(() => {
        if (is_sell_advert) {
            onSelectPaymentMethods(selected_sell_methods);
        } else {
            onSelectPaymentMethods(selected_buy_methods);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_sell_advert, selected_buy_methods, selected_sell_methods]);

    if (is_sell_advert) {
        if (p2p_advertiser_payment_methods?.length) {
            return (
                <SellAdPaymentMethodsList
                    selected_methods={selected_sell_methods}
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
            is_alignment_top
            selected_methods={selected_buy_methods}
            setSelectedMethods={setSelectedBuyMethods}
        />
    );
};

export default observer(CreateAdFormPaymentMethods);
