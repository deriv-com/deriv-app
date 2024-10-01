import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import BottomNav from '../bottom-nav';
import { BrowserRouter } from 'react-router-dom';

jest.mock('@deriv-com/quill-ui', () => ({
    ...jest.requireActual('@deriv-com/quill-ui'),
    Badge: jest.fn(() => {
        return 'MockedBadge';
    }),
}));
describe('BottomNav', () => {
    const default_mock_store = mockStore({});
    const mockedTradeContainer = <div>MockedTrade</div>;
    const mockedPositionsContainer = <div>MockedPositions</div>;
    const renderedBottomNav = (
        <StoreProvider store={default_mock_store}>
            <BrowserRouter>
                <BottomNav>
                    <div>{mockedTradeContainer}</div>
                    <div>{mockedPositionsContainer}</div>
                </BottomNav>
            </BrowserRouter>
        </StoreProvider>
    );
    it('should render correctly', () => {
        const { container } = render(renderedBottomNav);
        expect(container).toBeInTheDocument();
    });
    it('should render the correct number of BottomNavItem components', () => {
        default_mock_store.client.is_logged_in = true;
        render(renderedBottomNav);
        expect(screen.getByText('Positions')).toBeInTheDocument();
        expect(screen.getByText('Trade')).toBeInTheDocument();
    });
    it('should render MockedTrade by default since selected index is 0', () => {
        default_mock_store.client.is_logged_in = true;
        render(renderedBottomNav);
        expect(screen.getByText('MockedTrade')).toBeInTheDocument();
    });
    it('should render MockedPositions if 2nd MockedBottomNavItem is selected', () => {
        default_mock_store.client.is_logged_in = true;
        render(renderedBottomNav);
        userEvent.click(screen.getByText('Positions'));
        expect(screen.getByText('MockedPositions')).toBeInTheDocument();
    });
});
