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
                'We’ll offer to buy your contract at this price should you choose to sell it before its expiry. This is based on several factors, such as the current spot price. We won’t offer a contract value if the remaining duration is below 15 seconds or if the contract duration is in ticks.'
            )
        ).toBeInTheDocument();
    });
    it('Ensure TRADE_TYPES.MULTIPLIER glossary is rendered properly if it is TRADE_TYPES.MULTIPLIER synthetic', () => {
        render(<ContractTypeGlossary category={TRADE_TYPES.MULTIPLIER} />);

        expect(screen.getByText(deal_cancellation)).toBeInTheDocument();
        expect(screen.getByText(stop_out)).toBeInTheDocument();
    });
    it('Ensure TRADE_TYPES.MULTIPLIER glossary is rendered properly if it is multiplier_fx', () => {
        render(<ContractTypeGlossary category={TRADE_TYPES.MULTIPLIER} is_multiplier_fx />);

        expect(screen.queryByText(deal_cancellation)).not.toBeInTheDocument();
        expect(screen.getByText(/current-tick-execution/i)).toBeInTheDocument();
        expect(screen.queryByText(/next-tick-execution/i)).not.toBeInTheDocument();
        expect(screen.getByText(stop_out)).toBeInTheDocument();
    });
    it('Ensure TRADE_TYPES.MULTIPLIER glossary is rendered properly if it is major pairs  symbol and multiplier_fx', () => {
        render(<ContractTypeGlossary category={TRADE_TYPES.MULTIPLIER} is_multiplier_fx is_major_pairs />);

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
