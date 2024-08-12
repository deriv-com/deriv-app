import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { TradingDisabledByResidenceModalContent } from '../trading-disabled-by-residence-modal-content';

describe('<TradingDisabledByResidenceModalContent />', () => {
    const mockDefault = mockStore({});

    const wrapper = (mock: ReturnType<typeof mockStore> = mockDefault) => {
        const Component = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        return Component;
    };

    it('should render modal content with correct title', () => {
        render(<TradingDisabledByResidenceModalContent />, {
            wrapper: wrapper(),
        });

        expect(screen.getByText(/Trading disabled/)).toBeInTheDocument();
    });
});
