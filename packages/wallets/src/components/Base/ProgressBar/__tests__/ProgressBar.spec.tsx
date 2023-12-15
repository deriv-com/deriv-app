import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
    const mockProps: React.ComponentProps<typeof ProgressBar> = {
        activeIndex: 1,
        indexes: ['101', '102', '103'],
        setActiveIndex: jest.fn(),
    };

    it('should render properly with list of indexes', () => {
        render(<ProgressBar {...mockProps} />);
        const items = screen.getByRole('progressbar').childNodes;
        expect(items).toHaveLength(3);
    });

    it('should render the active item correctly', () => {
        render(<ProgressBar {...mockProps} />);
        const items = screen.getByRole('progressbar').childNodes;
        expect(items[0]).toHaveClass('wallets-progress-bar-active');
        items.forEach((element, index) => {
            if (index !== 0) {
                expect(element).toHaveClass('wallets-progress-bar-inactive');
            }
        });
    });

    it('should support progress bar animation when in transition ', () => {
        render(<ProgressBar {...mockProps} isTransition />);
        const items = screen.getByRole('progressbar').childNodes;
        expect(items).toHaveLength(3);
        items.forEach(element => {
            expect(element).toHaveClass('wallets-progress-bar-transition');
        });
    });

    it('should not apply transition class if inTransition false', () => {
        render(<ProgressBar {...mockProps} isTransition={false} />);
        const items = screen.getByRole('progressbar').childNodes;

        expect(items).toHaveLength(3);
        items.forEach(element => {
            expect(element).not.toHaveClass('wallets-progress-bar-transition');
        });
    });

    it('should set the active index on Click', () => {
        render(<ProgressBar {...mockProps} />);
        const items = screen.getByRole('progressbar').childNodes;
        userEvent.click(items[2] as HTMLElement);
        expect(mockProps.setActiveIndex).toHaveBeenCalledWith('103');
    });
});
