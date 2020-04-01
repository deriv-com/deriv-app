import React from 'react';
import { render } from '@testing-library/react';
import Calendar from '../calendar.jsx';

// TODO: add tests
describe('Calendar', () => {
    it('renders without crashing', () => {
        render(<Calendar />);
    });
});
