import React from 'react';
import { render, screen } from '@testing-library/react';
import { isNavigationFromDerivGO } from '../../../utils/platform';
import { AccountClosureSteps } from '../AccountClosureSteps';

jest.mock('../../../utils/platform', () => ({
    isNavigationFromDerivGO: jest.fn().mockReturnValue(false),
}));

describe('AccountClosureSteps', () => {
    it('should render the AccountClosureSteps component', () => {
        render(<AccountClosureSteps handleOnSubmit={jest.fn()} />);

        expect(screen.getAllByRole('listitem')).toHaveLength(4);
        expect(screen.getAllByRole('button')).toHaveLength(2);
        expect(screen.getByRole('link')).toHaveAttribute('href', 'https://deriv.com/tnc/security-and-privacy.pdf');
    });

    it('should render only one button if isNavigationFromDerivGO returns true', () => {
        (isNavigationFromDerivGO as jest.Mock).mockReturnValue(true);
        render(<AccountClosureSteps handleOnSubmit={jest.fn()} />);

        expect(screen.getByRole('button', { name: /close my account/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
    });
});
