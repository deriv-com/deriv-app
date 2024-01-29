import React from 'react';
import { render, screen } from '@testing-library/react';
import PoaNotRequired from '..';

jest.mock('@deriv/components', () => {
    const originalModule = jest.requireActual('@deriv/components');
    return {
        ...originalModule,
        Icon: jest.fn(() => <div>Mocked Icon</div>),
    };
});

describe('<PoaNotRequired />', () => {
    it('should render <PoaNotRequired /> component with its content', () => {
        render(<PoaNotRequired />);
        expect(screen.getByText('Proof of address verification not required')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Your account does not need address verification at this time. We will inform you if address verification is required in the future.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Mocked Icon')).toBeInTheDocument();
    });
});
