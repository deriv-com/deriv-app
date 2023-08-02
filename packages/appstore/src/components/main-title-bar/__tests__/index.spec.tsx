import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { APIProvider } from '@deriv/api';
import MainTitleBar from '..';

describe('MainTitleBar', () => {
    const render_container = () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        return render(<MainTitleBar />, {
            wrapper,
        });
    };

    it('should render the component', () => {
        const { container } = render_container();
        expect(container).toBeInTheDocument();
    });

    it('should render the correct title text', () => {
        render_container();
        expect(screen.getByText(/Trader's Hub/)).toBeInTheDocument();
    });

    it('should render the total assets text', () => {
        render_container();
        expect(screen.getByText(/Total assets/)).toBeInTheDocument();
    });
});
