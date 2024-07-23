import React from 'react';
import { render, screen } from '@testing-library/react';
import CommonMistakesExamples from '../CommonMistakesExamples';

jest.mock('../../../../../public/images/status-loss.svg', () => {
    const MockStatusLoss = () => <img alt='StatusLoss' />;
    MockStatusLoss.displayName = 'StatusLoss';
    return MockStatusLoss;
});

describe('CommonMistakesExamples', () => {
    it('renders the description and image', () => {
        const mockDescription = 'Test description';
        const mockImage = <img alt='mock' />;

        render(<CommonMistakesExamples description={mockDescription} image={mockImage} />);

        expect(screen.getByText(mockDescription)).toBeInTheDocument();
        expect(screen.getByAltText('mock')).toBeInTheDocument();
    });

    it('renders the StatusLoss image', () => {
        const mockDescription = 'Test description';
        const mockImage = <img alt='mock' />;

        render(<CommonMistakesExamples description={mockDescription} image={mockImage} />);

        expect(screen.getByAltText('StatusLoss')).toBeInTheDocument();
    });
});
