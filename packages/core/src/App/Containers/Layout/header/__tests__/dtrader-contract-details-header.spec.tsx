import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import DTraderContractDetailsHeader from '../dtrader-v2-contract-detail-header';
import userEvent from '@testing-library/user-event';

jest.mock('@deriv-com/quill-ui', () => ({
    Text: () => <div>Contract Details</div>,
}));

describe('DTraderV2Header', () => {
    test('renders the header with localized text and an icon', () => {
        const history = createMemoryHistory();
        render(
            <Router history={history}>
                <DTraderContractDetailsHeader />
            </Router>
        );

        expect(screen.getByText('Contract Details')).toBeInTheDocument();

        const icon = screen.getByTestId('arrow');
        expect(icon).toBeInTheDocument();
    });

    test('clicking the back arrow calls history.goBack', () => {
        const history = createMemoryHistory();

        history.goBack = jest.fn();

        render(
            <Router history={history}>
                <DTraderContractDetailsHeader />
            </Router>
        );

        userEvent.click(screen.getByTestId('arrow'));

        expect(history.goBack).toHaveBeenCalled();
    });
});
