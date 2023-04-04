import React from 'react';
import { render, screen } from '@testing-library/react';
import UserGuide from '../user-guide';
import userEvent from '@testing-library/user-event';
import { mocked_props } from './dashboard-components.spec';

describe('<UserGuide />', () => {
    it('renders user guide button', () => {
        render(<UserGuide {...mocked_props} />);
        const use_guide_button = screen.getByTestId('btn-use-guide');
        userEvent.click(use_guide_button);
        expect(screen.getByTestId('btn-use-guide')).toBeInTheDocument();
    });
});
