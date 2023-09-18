import { screen, render } from '@testing-library/react';
import React from 'react';
import POONotRequired from '../index';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => <div>Mocked Icon</div>),
    };
});

describe('<POONotRequired />', () => {
    it('should render <POONotRequired /> component with its content', () => {
        render(<POONotRequired />);
        expect(screen.getByText("Your proof of ownership isn't required.")).toBeInTheDocument();
        expect(
            screen.getByText(
                'You are not required to submit proof of ownership at this time. We will inform you if proof of ownership is required in the future.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Mocked Icon')).toBeInTheDocument();
    });
});
