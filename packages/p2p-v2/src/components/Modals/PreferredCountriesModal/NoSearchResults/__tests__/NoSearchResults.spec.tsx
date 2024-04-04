import React from 'react';
import { render, screen } from '@testing-library/react';
import NoSearchResults from '../NoSearchResults';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

describe('NoSearchResults', () => {
    it('should render', () => {
        render(<NoSearchResults value='test' />);
        expect(screen.getByText('No results for “test”.')).toBeInTheDocument();
        expect(screen.getByText('Check your spelling or use a different term.')).toBeInTheDocument();
    });
});
