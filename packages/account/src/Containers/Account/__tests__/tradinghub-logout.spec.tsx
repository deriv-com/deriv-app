import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TradingHubLogout from '../tradinghub-logout';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useOauth2: jest.fn(({ handleLogout }) => ({
        isOAuth2Enabled: true,
        oAuthLogout: jest.fn(() => handleLogout && handleLogout()),
    })),
}));
describe('TradingHubLogout', () => {
    const mock_props: React.ComponentProps<typeof TradingHubLogout> = {
        handleOnLogout: jest.fn(),
    };

    it('should render logout tab', () => {
        render(<TradingHubLogout {...mock_props} />);
        expect(screen.getByText('Log out')).toBeInTheDocument();
    });

    it('should invoke handleOnLogout when logout tab is clicked', async () => {
        render(<TradingHubLogout {...mock_props} />);
        const el_tab = screen.getByTestId('dt_logout_tab');
        await userEvent.click(el_tab);
        expect(mock_props.handleOnLogout).toHaveBeenCalledTimes(1);
    });
});
