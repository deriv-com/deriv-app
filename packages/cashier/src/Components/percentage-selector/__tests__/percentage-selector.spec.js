import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import PercentageSelector from '../percentage-selector';

describe('<PercentageSelector />', () => {
    const getCalculatedAmount = jest.fn();

    it('should render the component', () => {
        const { container } = render(<PercentageSelector getCalculatedAmount={getCalculatedAmount} />);

        expect(container.firstChild).toHaveClass('percentage-selector');
    });

    it('should calculate amount on click of percentage block', () => {
        const { container } = render(
            <PercentageSelector amount={100} currency={'USD'} getCalculatedAmount={getCalculatedAmount} />
        );

        container.querySelectorAll('.percentage-selector-block').forEach(block => {
            fireEvent.click(block);

            const percentage = block.previousSibling.innerHTML === 'All' ? '100%' : block.previousSibling.innerHTML;
            expect(screen.getByText(`${percentage} of available balance (100.00 USD)`)).toBeInTheDocument();
        });
    });

    it('should change the background color to green on click of percentage block', () => {
        const { container } = render(<PercentageSelector getCalculatedAmount={getCalculatedAmount} />);

        container.querySelectorAll('.percentage-selector-block').forEach(block => {
            fireEvent.click(block);
            expect(block).toHaveStyle('background-color: var(--general-section-1)');
        });
    });

    it('should remove the background color on clicking twice of percentage block', () => {
        const { container } = render(<PercentageSelector getCalculatedAmount={getCalculatedAmount} />);

        container.querySelectorAll('.percentage-selector-block').forEach(block => {
            fireEvent.click(block);
            expect(block).toHaveStyle('background-color: var(--status-success)');
        });

        container.querySelectorAll('.percentage-selector-block').forEach(block => {
            fireEvent.click(block);
            expect(block).toHaveStyle('background-color: var(--general-section-1)');
        });
    });

    it('should reset the percentage', () => {
        const { container } = render(
            <PercentageSelector
                amount={100}
                currency={'USD'}
                getCalculatedAmount={getCalculatedAmount}
                should_percentage_reset
            />
        );

        container.querySelectorAll('.percentage-selector-block').forEach(block => {
            expect(block).toHaveStyle('background-color: var(--general-section-1)');
        });

        expect(screen.getByText('0% of available balance (100.00 USD)')).toBeInTheDocument();
    });
});
