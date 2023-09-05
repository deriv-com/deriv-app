import React from 'react';
import { screen, render } from '@testing-library/react';
import UnsupportedFailed from '../unsupported-failed';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => <div>Mocked Icon</div>),
    };
});

describe('<UnsupportedFailed />', () => {
    const error = 'error';
    it('should render <UnsupportedFailed /> component with its content', () => {
        render(<UnsupportedFailed error={error} />);
        expect(screen.getByText('Proof of identity documents upload failed')).toBeInTheDocument();
        expect(screen.getByText('error')).toBeInTheDocument();
        expect(screen.getByText('Mocked Icon')).toBeInTheDocument();
    });
});
