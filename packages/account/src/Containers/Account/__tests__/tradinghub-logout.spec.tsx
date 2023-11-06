import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TradingHubLogout from '../tradinghub-logout';

describe('TradingHubLogout', () => {
    const mock_props: React.ComponentProps<typeof TradingHubLogout> = {
        handleOnLogout: jest.fn(),
    };

    it('should render logout tab', () => {
        render(<TradingHubLogout {...mock_props} />);
        expect(screen.getByText('Log out')).toBeInTheDocument();
    });

    it('should invoke handleOnLogout when logout tab is clicked', () => {
        render(<TradingHubLogout {...mock_props} />);
        const el_tab = screen.getByTestId('dt_logout_tab');
        userEvent.click(el_tab);
        expect(mock_props.handleOnLogout).toBeCalledTimes(1);
    });
});
