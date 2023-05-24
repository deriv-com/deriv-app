import React from 'react';
import { screen, render } from '@testing-library/react';
import { mockStore, StoreProvider } from '@deriv/stores';
import EmptyOnboarding from '../empty-onboarding';

describe('EmptyOnboarding', () => {
    it('Should render <EmptyOnboarding/>', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<EmptyOnboarding />, {
            wrapper,
        });

        expect(container).toBeInTheDocument();
    });

    it('Should render correct header in <EmptyOnboarding/>', () => {
        render(<EmptyOnboarding />);
        expect(screen.getByTestId('deriv_trading_header')).toBeInTheDocument();
    });
});
