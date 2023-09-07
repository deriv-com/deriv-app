import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import MainTitleBar from '..';

describe('MainTitleBar', () => {
    const mock = mockStore({});
    const render_container = () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
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

    it('should shouw total assets loader when platforms are not yet loaded', async () => {
        render_container();
        expect(screen.getByText(/Loading/)).toBeInTheDocument();
    });

    it('should render the total assets textwhen platforms are loaded', async () => {
        mock.client.is_landing_company_loaded = true;
        render_container();
        expect(screen.getByText(/Total assets/)).toBeInTheDocument();
    });
});
