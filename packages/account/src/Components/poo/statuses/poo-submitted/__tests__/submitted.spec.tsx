import React from 'react';
import { screen, render } from '@testing-library/react';
import POOSubmitted from '../index';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => <div>Mocked Icon</div>),
    };
});

describe('<POOSubmitted />', () => {
    it('Should render <POOSubmitted and its contents', () => {
        render(<POOSubmitted />);
        expect(screen.getByText('We’ve received your proof of ownership.')).toBeInTheDocument();
        expect(
            screen.getByText('We’ll review your documents and notify you of its status within 3 days.')
        ).toBeInTheDocument();
        expect(screen.getByText('Mocked Icon')).toBeInTheDocument();
    });
});
