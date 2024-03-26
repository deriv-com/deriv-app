import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentAgentSearchBox from '../PaymentAgentSearchBox';

jest.mock('../../../../../components', () => ({
    SearchBox: jest.fn(() => <div>SearchBox</div>),
}));

jest.mock('../../../provider', () => ({
    usePaymentAgentContext: jest.fn(() => ({ onChangeSearchTermHandler: jest.fn() })),
}));

describe('PaymentAgentSearchBox', () => {
    it('should render PaymentAgentSearchBox', () => {
        render(<PaymentAgentSearchBox />);

        expect(screen.getByText('SearchBox')).toBeInTheDocument();
    });
});
