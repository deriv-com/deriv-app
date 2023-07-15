import React from 'react';
import { screen, render } from '@testing-library/react';
import POORejected from '../index';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => <div>Mocked Icon</div>),
    };
});

describe('<POORejected />', () => {
    it('Should render <POORejected /> and its contents', () => {
        const onTryAgain = jest.fn();
        render(<POORejected onTryAgain={onTryAgain} />);
        expect(screen.getByText('Mocked Icon')).toBeInTheDocument();
        expect(screen.getByText('Proof of ownership verification failed')).toBeInTheDocument();
        expect(screen.getByText('We were unable to verify your proof of ownership.')).toBeInTheDocument();
        expect(screen.getByText('Try again')).toBeInTheDocument();
    });
});
