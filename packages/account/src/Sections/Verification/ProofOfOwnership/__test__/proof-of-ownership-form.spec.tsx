import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import ProofOfOwnershipForm from '../proof-of-ownership-form';

import { grouped_payment_method_data } from './test-data';

describe('proof-of-ownership-form.jsx', () => {
    it('should render a single card item inside the form', () => {
        render(
            <ProofOfOwnershipForm
                grouped_payment_method_data={{ beyonic: grouped_payment_method_data.beyonic }}
                updateAccountStatus={jest.fn()}
                refreshNotifications={jest.fn()}
                is_dark_mode={false}
                client_email={'test@testing.com'}
                citizen='id'
            />
        );
        const cardItems = screen.getByTestId('beyonic');
        expect(cardItems).toBeInTheDocument();
    });

    it('should render multiple card items inside the form', () => {
        render(
            <ProofOfOwnershipForm
                grouped_payment_method_data={grouped_payment_method_data}
                updateAccountStatus={jest.fn()}
                refreshNotifications={jest.fn()}
                is_dark_mode={false}
                client_email={'test@testing.com'}
                citizen='id'
            />
        );
        Object.keys(grouped_payment_method_data).forEach(key => {
            const cardItem = screen.getByTestId(key);
            expect(cardItem).toBeInTheDocument();
        });
    });

    it('should format identifier', async () => {
        render(
            <ProofOfOwnershipForm
                grouped_payment_method_data={{ visa: grouped_payment_method_data.visa }}
                updateAccountStatus={jest.fn()}
                refreshNotifications={jest.fn()}
                is_dark_mode={false}
                client_email={'test@testing.com'}
                citizen='id'
            />
        );
        const poo_dropdown_button = await screen.findByTestId('dt_proof_of_ownership_button');
        fireEvent.click(poo_dropdown_button);
        const identifier_input = await screen.findByTestId('dt_payment_method_identifier');
        fireEvent.change(identifier_input, { target: { value: '1234567891011121' } });
        fireEvent.blur(identifier_input);
        const element = screen.getByDisplayValue('1234 56XX XXXX 1121');
        expect(element).toBeInTheDocument();
    });
});
