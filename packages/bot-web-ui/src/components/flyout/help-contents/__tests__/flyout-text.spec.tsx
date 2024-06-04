import React from 'react';
import { render, screen } from '@testing-library/react';
import FlyoutText from '../flyout-text';

describe('FlyoutText', () => {
    const sampleText = 'Sample text for testing';

    beforeEach(() => {
        render(<FlyoutText text={sampleText} />);
    });

    it('renders the provided text', () => {
        const renderedText = screen.getByText(sampleText);

        expect(renderedText).toBeInTheDocument();
    });

    it('renders with the correct styles', () => {
        const renderedText = screen.getByText(sampleText);

        expect(renderedText).toHaveStyle('lineHeight: 1.3em');
    });
});
