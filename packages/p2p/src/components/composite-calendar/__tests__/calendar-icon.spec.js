import React from 'react';
import { render, screen } from '@testing-library/react';
import CalendarIcon from '../calendar-icon';

describe('<CalendarIcon/>', () => {
    it('should render the component', () => {
        render(<CalendarIcon />);

        expect(screen.getByTestId('dt_calendar_icon')).toBeInTheDocument();
    });
});
