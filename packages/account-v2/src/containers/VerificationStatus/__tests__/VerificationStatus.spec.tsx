import React from 'react';
import { render, screen } from '@testing-library/react';
import { VerificationStatus } from '../VerificationStatus';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: jest.fn(),
    }),
}));

describe('VerificationStatus', () => {
    it('should render VerificationStatus for IDV when status is pending', () => {
        render(<VerificationStatus isPOARequired={true} service='idv' status='pending' />);

        expect(screen.getByText('Your proof of identity was submitted successfully')).toBeInTheDocument();
        expect(
            screen.getByText("We'll review your documents and notify you of its status within 5 minutes.")
        ).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveTextContent('Submit proof of address');
    });

    it('should render VerificationStatus for IDV when status is verified', () => {
        render(<VerificationStatus isPOARequired={false} service='idv' status='verified' />);

        expect(screen.getByText('ID verification passed')).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveTextContent('Continue trading');
    });

    it('should render VerificationStatus for manual when status is pending', () => {
        render(<VerificationStatus isPOARequired={false} service='manual' status='pending' />);

        expect(screen.getByText('Your proof of identity was submitted successfully')).toBeInTheDocument();
        expect(
            screen.getByText("We'll review your documents and notify you of its status within 1-3 days.")
        ).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveTextContent('Continue trading');
    });
});
