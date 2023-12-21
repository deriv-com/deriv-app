import React from 'react';
import { render, screen } from '@testing-library/react';
import CompositeCalendarMobileFooter from '../composite-calendar-mobile-footer';
import userEvent from '@testing-library/user-event';

const mock_props = {
    applyDateRange: jest.fn(),
    onCancel: jest.fn(),
};

describe('CompositeCalendarMobileFooter', () => {
    it('should render the component', () => {
        render(<CompositeCalendarMobileFooter {...mock_props} />);
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('OK')).toBeInTheDocument();
    });
    it('should handle Cancel click', () => {
        render(<CompositeCalendarMobileFooter {...mock_props} />);
        userEvent.click(screen.getByText('Cancel'));
        expect(mock_props.onCancel).toHaveBeenCalled();
    });
    it('should handle OK button click', () => {
        render(<CompositeCalendarMobileFooter {...mock_props} />);
        userEvent.click(screen.getByText('OK'));
        expect(mock_props.applyDateRange).toHaveBeenCalled();
    });
});
