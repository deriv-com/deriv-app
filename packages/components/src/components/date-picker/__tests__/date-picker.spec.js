import React from 'react';
import { render } from '@testing-library/react';
import ThemeProvider from 'Components/theme-provider/theme-provider.jsx';
import DatePicker from '../date-picker.jsx';

// TODO: add tests
describe('DatePicker', () => {
    it('renders without crashing', () => {
        render(
            <ThemeProvider>
                <DatePicker />
            </ThemeProvider>
        );
    });
});
