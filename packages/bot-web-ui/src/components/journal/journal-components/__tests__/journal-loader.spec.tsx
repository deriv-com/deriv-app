import React from 'react';
import { render, screen } from '@testing-library/react';
import JournalLoader from '../journal-loader';

jest.mock('react-content-loader', () => {
    return jest.fn(({ children, ...props }: { children: React.ReactElement; is_mobile: boolean }) => (
        <div data-testid='mock-content-loader' {...props}>
            {children}
        </div>
    ));
});

describe('JournalLoader', () => {
    it('Renders correctly for desktop', () => {
        render(<JournalLoader is_mobile={false} />);

        const journal_loader = screen.getByTestId('mock-content-loader');

        expect(journal_loader).toBeInTheDocument();
        expect(journal_loader).not.toHaveClass('journal__loader--mobile');
    });

    it('Renders correctly for mobile with given props', () => {
        render(<JournalLoader is_mobile={true} />);

        const journal_loader = screen.getByTestId('mock-content-loader');

        expect(journal_loader).toBeInTheDocument();

        expect(journal_loader).toHaveClass('journal__loader--mobile');
        expect(journal_loader).toHaveAttribute('backgroundcolor', 'var(--general-section-1)');
        expect(journal_loader).toHaveAttribute('foregroundcolor', 'var(--general-hover)');
    });
});
