import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlertComponent from '../AlertComponent';

const mockProps = {
    setIsModalOpen: jest.fn(),
};
describe('AlertComponent', () => {
    it('should render the component as expected', () => {
        render(<AlertComponent {...mockProps} />);
        expect(screen.getByTestId('dt_p2p_v2_alert_icon')).toBeInTheDocument();
    });
    it('should show the tooltip text on hovering the icon', () => {
        render(<AlertComponent {...mockProps} />);
        const icon = screen.getByTestId('dt_p2p_v2_alert_icon');
        userEvent.hover(icon);
        expect(screen.getByText('Ad not listed')).toBeInTheDocument();
    });
    it('should handle the onclick', () => {
        render(<AlertComponent {...mockProps} />);
        const button = screen.getByRole('button');
        userEvent.click(button);
        expect(mockProps.setIsModalOpen).toBeCalledTimes(1);
    });
});
