import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { CryptoTransactionProcessingModalContent } from '../crypto-transaction-processing-modal-content';

describe('<CryptoTransactionProcessingModalContent />', () => {
    const mockDefault = mockStore({});

    const wrapper = (mock: ReturnType<typeof mockStore> = mockDefault) => {
        const Component = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        return Component;
    };

    it('should render modal content with correct title', () => {
        render(<CryptoTransactionProcessingModalContent />, {
            wrapper: wrapper(),
        });

        expect(screen.getByText(/Transaction processing/)).toBeInTheDocument();
    });
});
