import React from 'react';
import { render, screen } from '@testing-library/react';
import CommonMistakeExamples from '../common-mistake-examples';

jest.mock('Assets/ic-error-badge.svg', () => jest.fn(() => 'ErrorIcon'));

describe('CommonMistakeExamples', () => {
    it('should render the component with 6 mistake descriptions', () => {
        render(<CommonMistakeExamples />);
        expect(screen.getAllByRole('document')).toHaveLength(6);
    });
});
