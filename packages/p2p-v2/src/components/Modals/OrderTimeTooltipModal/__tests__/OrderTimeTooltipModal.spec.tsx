import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderTimeTooltipModal from '../OrderTimeTooltipModal';

const mockProps = {
    orderTimeInfoMessage: 'this is the tooltip message',
    isModalOpen: true,
    onRequestClose: jest.fn(),
};

describe('<RatingModal />', () => {
    it('should render just the star rating initially', () => {
        render(<OrderTimeTooltipModal {...mockProps} />);
        expect(screen.getByText('this is the tooltip message')).toBeInTheDocument();
    });
    it('should handle the onclick for ok button', () => {
        render(<OrderTimeTooltipModal {...mockProps} />);
        const okButton = screen.getByRole('button', { name: 'Ok' });
        userEvent.click(okButton);
        expect(mockProps.onRequestClose).toBeCalledTimes(1);
    });
});
