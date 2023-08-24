import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import MainTitleBar from '..';

describe('MainTitleBar', () => {
    const render_container = (mock: any) => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        return render(<MainTitleBar />, {
            wrapper,
        });
    };

    it('should render the component', () => {
        const mock = mockStore({});
        const { container } = render_container(mock);
        expect(container).toBeInTheDocument();
    });

    it('should render the correct title text', () => {
        const mock = mockStore({});
        render_container(mock);
        expect(screen.getByText(/Trader's Hub/)).toBeInTheDocument();
    });

    it('should render the total assets text', () => {
        const mock = mockStore({
            exchange_rates: {
                data: {
                    date: 12345,
                },
            },
        });

        render_container(mock);
        expect(screen.getByText('Total assets')).toBeInTheDocument();
    });
});
