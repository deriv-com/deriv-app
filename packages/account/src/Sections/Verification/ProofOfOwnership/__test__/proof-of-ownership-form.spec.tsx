/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck [TODO] - Need to fix typescript errors

import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import ProofOfOwnershipForm from '../proof-of-ownership-form';

import { grouped_payment_method_data } from './test-data';
import { StoreProvider, mockStore } from '@deriv/stores';

type TRenderComponentProps = {
    props: React.ComponentProps<typeof ProofOfOwnershipForm>;
    store: ReturnType<typeof mockStore>;
};

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useFileUploader: jest.fn(() => ({
        upload: jest.fn(),
    })),
}));

describe('proof-of-ownership-form.jsx', () => {
    const mock_store = mockStore({
        client: {
            email: 'test@testing.com',
        },
    });

    const renderComponent = ({ props, store = mock_store }: TRenderComponentProps) => {
        return render(
            <StoreProvider store={store}>
                <ProofOfOwnershipForm {...props} />
            </StoreProvider>
        );
    };

    it('should render a single card item inside the form', () => {
        renderComponent({ props: { grouped_payment_method_data: { beyonic: grouped_payment_method_data.beyonic } } });

        const cardItems = screen.getByTestId('beyonic');
        expect(cardItems).toBeInTheDocument();
    });

    it('should render multiple card items inside the form', () => {
        renderComponent({
            props: { grouped_payment_method_data },
        });

        Object.keys(grouped_payment_method_data).forEach(key => {
            const cardItem = screen.getByTestId(key);
            expect(cardItem).toBeInTheDocument();
        });
    });

    it('should format identifier', async () => {
        renderComponent({
            props: { grouped_payment_method_data: { visa: grouped_payment_method_data.visa } },
        });

        const poo_dropdown_button = await screen.findByTestId('dt_proof_of_ownership_button');
        fireEvent.click(poo_dropdown_button);
        const identifier_input = await screen.findByTestId('dt_payment_method_identifier');
        fireEvent.change(identifier_input, { target: { value: '1234567891011121' } });
        fireEvent.blur(identifier_input);
        const element = screen.getByDisplayValue('1234 56XX XXXX 1121');
        expect(element).toBeInTheDocument();
    });
});
