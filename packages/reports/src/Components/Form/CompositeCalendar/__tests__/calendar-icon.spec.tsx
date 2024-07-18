import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalendarIcon from '../calendar-icon';

const mockDefaultProps = {
    onClick: jest.fn(),
};

describe('CalendarIcon', () => {
    it('should render component with default props', () => {
        render(<CalendarIcon {...mockDefaultProps} />);

        expect(screen.getByTestId('dt_calendar_icon')).toBeInTheDocument();
    });

    it('should call function onClick from props if user clicks on the component', () => {
        render(<CalendarIcon {...mockDefaultProps} />);

        expect(mockDefaultProps.onClick).not.toBeCalled();
        userEvent.click(screen.getByTestId('dt_calendar_icon'));
        expect(mockDefaultProps.onClick).toBeCalled();
    });
});
