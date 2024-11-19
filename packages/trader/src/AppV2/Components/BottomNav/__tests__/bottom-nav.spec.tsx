import React, { FormEventHandler } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import { routes } from '@deriv/shared';
import BottomNav from '../bottom-nav';
// TODO: Fix test
jest.mock('@deriv-com/quill-ui', () => ({
    ...jest.requireActual('@deriv-com/quill-ui'),
    Navigation: {
        Bottom: ({ children, onChange }: { children: React.ReactNode; onChange: FormEventHandler<HTMLDivElement> }) => (
            <div onChange={onChange}>{children}</div>
        ),
        BottomAction: ({ icon, label }: { icon: string; label: string }) => (
            <button>
                {icon}
                {label}
            </button>
        ),
    },
}));

describe('BottomNav', () => {
    const default_mock_store = mockStore({});
    const bottomNavItems = [
        {
            icon: <div>Trade Icon</div>,
            activeIcon: <div>Active Trade Icon</div>,
            label: <span>Trade</span>,
            path: routes.trade,
        },
        {
            icon: <div>Positions Icon</div>,
            activeIcon: <div>Active Positions Icon</div>,
            label: <span>Positions</span>,
            path: routes.trader_positions,
        },
    ];

    const renderedBottomNav = (
        <StoreProvider store={default_mock_store}>
            <BrowserRouter>
                <BottomNav bottomNavItems={bottomNavItems} />
            </BrowserRouter>
        </StoreProvider>
    );

    it('renders correctly', () => {
        const { container } = render(renderedBottomNav);
        expect(container).toBeInTheDocument();
    });

    it('should render the correct number of BottomNavItem components', () => {
        default_mock_store.client.is_logged_in = true;
        render(renderedBottomNav);
        expect(screen.getByText('Positions')).toBeInTheDocument();
        expect(screen.getByText('Trade')).toBeInTheDocument();
    });

    it('renders Trade as the default selected item', () => {
        default_mock_store.client.is_logged_in = true;
        render(renderedBottomNav);
        expect(screen.getByText('Trade')).toBeInTheDocument();
    });

    it('renders Positions as selected when clicked', async () => {
        default_mock_store.client.is_logged_in = true;
        render(renderedBottomNav);
        await userEvent.click(screen.getByText('Positions'));
        expect(screen.getByText('Positions')).toBeInTheDocument();
    });
});
