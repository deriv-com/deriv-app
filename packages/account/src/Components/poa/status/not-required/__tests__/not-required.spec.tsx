import React from 'react';
import { screen, render } from '@testing-library/react';
import PoaNotRequired from '../index';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
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
