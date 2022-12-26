import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { NetworkStatus } from '../network-status.jsx';

const MockNetworkStatus = ({ is_mobile = true }) => (
    <NetworkStatus status={{ class: 'offline' }} is_mobile={is_mobile} />
);

describe('network-status component', () => {
    it('should has "network-status__wrapper--is-mobile" class when the "is_mobile" property is true', () => {
        render(<MockNetworkStatus />);
        const div_element = screen.getByTestId('dt_network_status');
        expect(div_element).toHaveClass('network-status__wrapper--is-mobile');
    });

    it('should has correct class based on class passed in the "status" property', () => {
        const { rerender } = render(<NetworkStatus status={{ class: 'offline' }} />);
        expect(screen.getByTestId('dt_network_status_element')).toHaveClass('network-status__circle--offline');

        rerender(<NetworkStatus status={{ class: 'online' }} />);
        expect(screen.getByTestId('dt_network_status_element')).toHaveClass('network-status__circle--online');

        rerender(<NetworkStatus status={{ class: 'blinker' }} />);
        expect(screen.getByTestId('dt_network_status_element')).toHaveClass('network-status__circle--blinker');
    });

    it('should contain "Popover" with default message when "status.tooltip" is empty', () => {
        render(<MockNetworkStatus is_mobile={false} />);
        const popover_wrapper = screen.getByTestId('dt_popover_wrapper');
        userEvent.hover(popover_wrapper);
        const network_status = screen.getByText(/connecting to server/i);
        expect(network_status).toBeInTheDocument();
    });

    it('should contain "Tooltip" message passed in the status property', () => {
        const status = {
            class: 'online',
            tooltip: 'Online',
        };

        render(<NetworkStatus status={status} />);
        const popover_wrapper = screen.getByTestId('dt_popover_wrapper');
        userEvent.hover(popover_wrapper);
        const network_status = screen.getByText(/online/i);
        expect(network_status).toBeInTheDocument();
    });
});
