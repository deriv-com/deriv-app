import React from 'react';
import { screen, render } from '@testing-library/react';
import POOVerified from '../index';

jest.mock('@deriv-app/components', () => {
    const original_module = jest.requireActual('@deriv-app/components');
    return {
        ...original_module,
        Icon: jest.fn(() => <div>Mocked Icon</div>),
    };
});

describe('<POOVerified />', () => {
    it('Should render <POOVerified /> and its contents', () => {
        render(<POOVerified />);
        expect(screen.getByText('Proof of ownership verification passed.')).toBeInTheDocument();
        expect(screen.getByText('Mocked Icon')).toBeInTheDocument();
    });
});
