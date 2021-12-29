import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import PercentageSelector from '../percentage-selector';

describe('<PercentageSelector />', () => {
    const getCalculatedAmount = jest.fn();

    it('should render the component', () => {
        const { container } = render(<PercentageSelector getCalculatedAmount={getCalculatedAmount} />);

        expect(container.firstChild).toHaveClass('percentage-selector');
    });

    it('should calculate the percentage amount on click of percentage block', () => {
        const { container } = render(
            <PercentageSelector amount={100} currency={'USD'} getCalculatedAmount={getCalculatedAmount} />
        );

        container.querySelectorAll('.percentage-selector-block').forEach(block => {
            fireEvent.click(block);

            const percentage = block.previousSibling.innerHTML === 'All' ? '100%' : block.previousSibling.innerHTML;
            expect(screen.getByText(`${percentage} of available balance (100.00 USD)`)).toBeInTheDocument();
        });
    });

    it('should reset the percentage block upon clicking twice', () => {
        const { container } = render(
            <PercentageSelector amount={100} currency={'USD'} getCalculatedAmount={getCalculatedAmount} />
        );

        container.querySelectorAll('.percentage-selector-block').forEach(block => {
            fireEvent.click(block);
            fireEvent.click(block);

            let percentage =
                block.previousSibling.innerHTML === 'All' ? 100 : parseInt(block.previousSibling.innerHTML);
            percentage -= 25;
            expect(screen.getByText(`${percentage}% of available balance (100.00 USD)`)).toBeInTheDocument();
        });
    });

    it('should reset the percentage', () => {
        render(
            <PercentageSelector
                amount={100}
                currency={'USD'}
                getCalculatedAmount={getCalculatedAmount}
                should_percentage_reset
            />
        );

        expect(screen.getByText('0% of available balance (100.00 USD)')).toBeInTheDocument();
    });
});
