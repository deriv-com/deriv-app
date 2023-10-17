import React from 'react';
import { render, screen } from '@testing-library/react';
import LbPutTradeDescription from '../lb-put-trade-description';

describe('<LbPutTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<LbPutTradeDescription />);

        expect(screen.getByText(/By purchasing the "High-to-Close" contract/i)).toBeInTheDocument();
    });
});
