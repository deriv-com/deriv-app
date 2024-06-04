import React from 'react';
import { render, screen } from '@testing-library/react';
import { PaymentMethodCardHeader } from '../PaymentMethodCardHeader';

jest.mock('../../../public/ic-cashier-ewallet.svg', () => 'span');

describe('PaymentMethodCardHeader', () => {
    it('should render the component correctly', () => {
        render(
            <PaymentMethodCardHeader
                onDeletePaymentMethod={() => undefined}
                onEditPaymentMethod={() => undefined}
                type='bank'
            />
        );
        expect(screen.getByTestId('dt_p2p_v2_payment_method_card_header')).toBeInTheDocument();
    });
    it('should render the component correctly when medium is true', () => {
        render(
            <PaymentMethodCardHeader
                medium
                onDeletePaymentMethod={() => undefined}
                onEditPaymentMethod={() => undefined}
                type='bank'
            />
        );
        expect(screen.getByTestId('dt_p2p_v2_payment_method_card_header')).toBeInTheDocument();
    });
    it('should render the component correctly when iseditable is true', () => {
        render(
            <PaymentMethodCardHeader
                isEditable
                onDeletePaymentMethod={() => undefined}
                onEditPaymentMethod={() => undefined}
                type='bank'
            />
        );
        expect(screen.getByTestId('dt_p2p_v2_flyout_toggle')).toBeInTheDocument();
    });
    it('should render the component correctly when isselectable is true', () => {
        render(
            <PaymentMethodCardHeader
                isSelectable
                onDeletePaymentMethod={() => undefined}
                onEditPaymentMethod={() => undefined}
                onSelectPaymentMethod={() => undefined}
                type='bank'
            />
        );
        expect(screen.getByTestId('p2p_v2_payment_method_card_header_checkbox')).toBeInTheDocument();
    });
    it('should render the correct icon when type is ewallet', () => {
        render(
            <PaymentMethodCardHeader
                onDeletePaymentMethod={() => undefined}
                onEditPaymentMethod={() => undefined}
                type='ewallet'
            />
        );
        expect(screen.getByTestId('dt_p2p_v2_payment_method_card_header_icon')).toBeInTheDocument();
    });
});
