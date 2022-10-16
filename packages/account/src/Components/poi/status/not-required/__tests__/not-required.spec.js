import React from 'react';
import { render, screen } from '@testing-library/react';
import { OnfidoNotRequired } from '../not-required';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => <div data-testid='dt_mocked_icon' />),
    };
});

describe('<OnfidoNotRequired /> ', () => {
    it('should render <OnfidoNotRequired /> component with content', () => {
        render(<OnfidoNotRequired />);
        expect(screen.getByText(/Proof of identity verification not required/)).toBeInTheDocument();
        expect(
            screen.getByText(
                /Your account does not need identity verification at this time. We will inform you if identity verification is required in the future./
            )
        ).toBeInTheDocument();
        expect(screen.getByTestId(/dt_mocked_icon/)).toBeInTheDocument();
    });
});
