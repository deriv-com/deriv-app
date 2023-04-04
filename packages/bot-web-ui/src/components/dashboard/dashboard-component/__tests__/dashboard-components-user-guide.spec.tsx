import React from 'react';
import { render, screen } from '@testing-library/react';
import UserGuide from '../user-guide';
import { mocked_props } from './dashboard-components.spec';

describe('<UserGuide />', () => {
    beforeEach(() => mocked_props);
    it('renders user guide button', () => {
        // arrange
        render(<UserGuide {...mocked_props} />);
        // assert
        expect(screen.getByTestId('btn-use-guide', { exact: true }));
    });
});
