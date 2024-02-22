import React from 'react';
import { APIProvider } from '@deriv/api';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileDailyLimit from '../ProfileDailyLimit';

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <div id='v2_modal_root' />
        {children}
    </APIProvider>
);

const mockUseAdvertiserStats = {
    data: {
        daily_buy_limit: 100,
        daily_sell_limit: 200,
    },
    isLoading: true,
};

jest.mock('@/hooks/useDevice', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        isMobile: false,
    })),
}));
jest.mock('@/hooks/useAdvertiserStats', () => ({
    __esModule: true,
    default: jest.fn(() => mockUseAdvertiserStats),
}));

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useActiveAccount: jest.fn(() => ({
        currency: 'USD',
    })),
}));

describe('ProfileDailyLimit', () => {
    it('should render the correct limits message', () => {
        render(<ProfileDailyLimit />, { wrapper });
        const tokens = ['Want to increase your daily limits to (buy) and (sell)?', '100 USD ', '200 USD '];

        expect(
            screen.getByText((content, element) => {
                return element?.tagName.toLowerCase() === 'span' && tokens.includes(content.trim());
            })
        ).toBeInTheDocument();
    });
    it('should render limits modal when requested to increase limits', () => {
        render(<ProfileDailyLimit />, { wrapper });
        const increaseLimitsBtn = screen.getByRole('button', {
            name: 'Increase my limits',
        });
        expect(screen.queryByTestId('dt_p2p_v2_daily_limit_modal')).not.toBeInTheDocument();
        userEvent.click(increaseLimitsBtn);
        expect(screen.getByTestId('dt_p2p_v2_daily_limit_modal')).toBeInTheDocument();
    });
});
