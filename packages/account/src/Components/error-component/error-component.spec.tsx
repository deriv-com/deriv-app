import React from 'react';
import { screen, render } from '@testing-library/react';
import ErrorComponent from './error-component';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    PageError: () => <div>PageError</div>,
}));

describe('<ErrorComponent/>', () => {
    it('should render PageError component', () => {
        render(<ErrorComponent />);
        expect(screen.getByText('PageError')).toBeInTheDocument();
    });
});
