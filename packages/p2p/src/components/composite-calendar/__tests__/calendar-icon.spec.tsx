import React from 'react';
import { render, screen } from '@testing-library/react';
import CalendarIcon from '../calendar-icon';

describe('<CalendarIcon />', () => {
    it('should render icon', () => {
        render(<CalendarIcon onClick={jest.fn()} />);
        expect(screen.getByTestId('dt_calendar_icon')).toBeInTheDocument();
    });
});
