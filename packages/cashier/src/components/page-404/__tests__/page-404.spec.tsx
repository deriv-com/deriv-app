import React from 'react';
import { render, screen } from '@testing-library/react';
import Page404 from '../page-404';

jest.mock('@deriv/components', () => ({
    __esModule: true,
    PageError: () => <div>Page not found</div>,
}));

describe('<Page404 />', () => {
    it('should show the proper error message', () => {
        render(<Page404 />);

        expect(screen.getByText('Page not found')).toBeInTheDocument();
    });
});
