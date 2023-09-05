import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { AdditionalKycInfoModal } from '../additional-kyc-info-modal';

jest.mock('../additional-kyc-info-form.tsx', () => jest.fn(() => <div>AdditionalKycInfoForm</div>));

let modal_root_el: HTMLElement;
const mock_store = mockStore({
    ui: {
        is_additional_kyc_info_modal_open: true,
        toggleAdditionalKycInfoModal: jest.fn(),
    },
});

describe('AdditionalKycInfoModal', () => {
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render the modal when is_additional_kyc_info_modal_open is true', () => {
        render(
            <StoreProvider store={mock_store}>
                <AdditionalKycInfoModal />
            </StoreProvider>
        );
        const modalTitle = screen.getByText('Additional information required for Deriv MT5 account(s)');
        expect(modalTitle).toBeInTheDocument();
    });
});
