import { screen, render, fireEvent } from '@testing-library/react';
import ProofOfOwnership from '../proof-of-ownership.jsx';
import React from 'react';

describe('proof of ownership', () => {
    it('should render proof of owndership component', () => {
        render(<ProofOfOwnership />);
        expect(screen.getByText('Please upload the following document.', { exact: true })).toBeInTheDocument();
        expect(screen.getByText('Credit/debit card', { exact: true })).toBeInTheDocument();
        const btn = screen.getByTestId('proof-of-ownership-button', { exact: true });
        expect(btn).toBeInTheDocument();
    });

    it('should render ExpandedCard on button click', () => {
        render(<ProofOfOwnership />);
        fireEvent.click(screen.getByTestId('proof-of-ownership-button', { exact: true }));
        expect(screen.getByText('Upload a photo of your', { exact: false })).toBeInTheDocument();
        expect(screen.getByText('Choose a photo', { exact: false })).toBeInTheDocument();
    });
});
