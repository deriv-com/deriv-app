import React from 'react';
import { render, screen } from '@testing-library/react';
import AdProgressBar from '../AdProgressBar';

const STEPS = [{ header: { title: 'step 1' } }, { header: { title: 'step 2' } }, { header: { title: 'step 3' } }];

describe('AdProgressBar', () => {
    it('should render the progress bar', () => {
        render(<AdProgressBar currentStep={1} steps={STEPS} />);
        expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });
});
