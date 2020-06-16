import React from 'react';
import { render } from '@testing-library/react';
import ThemeProvider from 'Components/theme-provider/theme-provider.jsx';
import Calendar from '../calendar.jsx';

// TODO: add tests
describe('Calendar', () => {
    it('renders without crashing', () => {
        render(
            <ThemeProvider>
                <Calendar />
            </ThemeProvider>
        );
    });
});
