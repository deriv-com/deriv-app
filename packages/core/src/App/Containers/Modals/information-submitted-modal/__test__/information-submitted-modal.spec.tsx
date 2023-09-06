import React from 'react';
import { screen, render } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import InformationSubmittedModal from '../information-submitted-modal';

describe('<InformationSubmittedModal/>', () => {
    const mock_store = mockStore({
        ui: {
            is_kyc_information_submitted_modal_open: true,
        },
    });

    it('should render InformationSubmittedModal component', () => {
        render(
            <StoreProvider store={mock_store}>
                <InformationSubmittedModal />
            </StoreProvider>
        );
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should render InformationSubmittedModal component with title and content', () => {
        render(
            <StoreProvider store={mock_store}>
                <InformationSubmittedModal />
            </StoreProvider>
        );
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/information updated/i);
        expect(screen.getByText(/thank you for submitting your information/i)).toBeInTheDocument();
    });
});
