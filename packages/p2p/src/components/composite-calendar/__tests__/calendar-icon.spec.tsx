import React from 'react';
import { render, screen } from '@testing-library/react';
import CalendarIcon from '../calendar-icon';
import userEvent from '@testing-library/user-event';

describe('<CalendarIcon />', () => {
    it('should render icon', () => {
        render(<CalendarIcon onClick={jest.fn()} />);
        expect(screen.getByTestId('dt_calendar_icon')).toBeInTheDocument();
    });
});
