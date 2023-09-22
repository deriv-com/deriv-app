import React from 'react';
import classNames from 'classnames';
import { ThemedScrollbars } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { localize } from 'Components/i18next';
import PaymentMethodCard from 'Pages/my-profile/payment-methods/payment-method-card';
import { useStores } from 'Stores';
import { TPaymentMethod, TPaymentMethodOrder } from 'Types';
import { available_payment_methods } from '../__mocks__/mock-data';

type TSellAdPaymentMethodsListProps = {
    is_only_horizontal?: boolean;
    onClickAdd?: () => void;
    onClickPaymentMethodCard: (payment_method: TPaymentMethod) => void;
    p2p_advertiser_payment_methods: TPaymentMethod[];
    selected_methods: string[];
};

const SellAdPaymentMethodsList = ({
    is_only_horizontal = isMobile(),
    onClickAdd,
    onClickPaymentMethodCard,
    p2p_advertiser_payment_methods,
    selected_methods,
}: TSellAdPaymentMethodsListProps) => {
    const { my_profile_store } = useStores();

    const style = {
        borderColor: 'var(--brand-secondary)',
        borderWidth: '2px',
    };

    // payment method order: Bank Transfer -> EWallets -> Others
    const payment_method_order: TPaymentMethodOrder = { bank_transfer: 0, other: 2 };
    const getPaymentMethodOrder = (method: keyof typeof available_payment_methods): number =>
        !(method in payment_method_order) ? 1 : payment_method_order[method] ?? 0;

    const sortPaymentMethods = (payment_methods_list: TPaymentMethod[]) =>
        payment_methods_list?.sort(
            (i: TPaymentMethod, j: TPaymentMethod) =>
                getPaymentMethodOrder(i?.method) - getPaymentMethodOrder(j?.method)
        );

    return (
        <ThemedScrollbars
            className={classNames('sell-ad-payment-methods-list__container', {
                'sell-ad-payment-methods-list__container--horizontal': is_only_horizontal,
            })}
            is_scrollbar_hidden
            is_only_horizontal={is_only_horizontal}
        >
            {p2p_advertiser_payment_methods && sortPaymentMethods(p2p_advertiser_payment_methods).map(
                (payment_method: TPaymentMethod) => (
                    <PaymentMethodCard
                        is_vertical_ellipsis_visible={false}
                        key={payment_method.ID}
                        medium
                        onClick={() => onClickPaymentMethodCard(payment_method)}
                        payment_method={payment_method}
                        style={selected_methods.includes(payment_method.ID) ? style : {}}
                    />
                )
            )}
            <PaymentMethodCard is_add label={localize('Payment method')} medium onClickAdd={onClickAdd} />
        </ThemedScrollbars>
    );
};

export default observer(SellAdPaymentMethodsList);
