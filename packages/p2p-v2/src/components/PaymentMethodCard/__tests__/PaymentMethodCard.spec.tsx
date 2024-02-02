import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentMethodCard from '../PaymentMethodCard';

describe('PaymentMethodCard', () => {
    it('should render the component', () => {
        render(
            <PaymentMethodCard
                onDeletePaymentMethod={() => undefined}
                onEditPaymentMethod={() => undefined}
                paymentMethod={{
                    fields: {},
                    id: 'test',
                    is_enabled: 0,
                    method: '',
                    type: 'other',
                    used_by_adverts: null,
                    used_by_orders: null,
                }}
            />
        );
        expect(screen.getByTestId('dt_p2p_v2_payment-method-card__header')).toBeInTheDocument();
    });
});
