import React from 'react';
import { render, screen } from '@testing-library/react';
import { TRADE_TYPES } from '@deriv/shared';
import ContractTypeGlossary from '../ContractTypeInfo/contract-type-glossary';

const deal_cancellation = 'Deal cancellation';
const stop_out = 'Stop out';

describe('<ContractTypeGlossary />', () => {
    it('Ensure accumulator glossary is rendered properly', () => {
        render(<ContractTypeGlossary category={TRADE_TYPES.ACCUMULATOR} />);

        expect(
            screen.getByText(/You can choose a growth rate with values of 1%, 2%, 3%, 4%, and 5%./i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                /If you select this feature, your trade will be closed automatically at the nearest available asset price when your profit reaches or exceeds the take profit amount. Your profit may be more than the amount you entered depending on the market price at closing./i
            )
        ).toBeInTheDocument();
    });
    it('Ensure vanilla glossary is rendered properly', () => {
        render(<ContractTypeGlossary category={TRADE_TYPES.VANILLA.CALL} />);

        expect(
            screen.getByText(
                'If you select "Call", you’ll earn a payout if the final price is above the strike price at expiry. Otherwise, you won’t receive a payout.'
            )
        ).toBeInTheDocument();
    });
    it('Ensure turbos glossary is rendered properly', () => {
        render(<ContractTypeGlossary category={TRADE_TYPES.TURBOS.LONG} />);

        expect(
            screen.getByText(
                'This is the resale value of your contract, based on the prevailing market conditions (e.g, the current spot), including additional commissions if any.'
            )
        ).toBeInTheDocument();
    });
    it('Ensure TRADE_TYPES.MULTIPLIER glossary is rendered properly if it is TRADE_TYPES.MULTIPLIER synthetic', () => {
        render(<ContractTypeGlossary category={TRADE_TYPES.MULTIPLIER} />);

        expect(screen.getByText(deal_cancellation)).toBeInTheDocument();
        expect(screen.getByText(stop_out)).toBeInTheDocument();
    });
    it('Ensure TRADE_TYPES.MULTIPLIER glossary is rendered properly if it is major pairs  symbol and multiplier_fx', () => {
        render(<ContractTypeGlossary category={TRADE_TYPES.MULTIPLIER} is_multiplier_fx />);

        expect(screen.queryByText(deal_cancellation)).not.toBeInTheDocument();
        expect(screen.queryByText(/current-tick-execution/i)).not.toBeInTheDocument();
        expect(screen.getByText(/next-tick-execution/i)).toBeInTheDocument();
        expect(screen.getByText(stop_out)).toBeInTheDocument();
    });
    it('Ensure placeholder text is rendered if category does not exist', () => {
        const { container } = render(<ContractTypeGlossary category='test' />);

        expect(container).toBeEmptyDOMElement();
    });
});
