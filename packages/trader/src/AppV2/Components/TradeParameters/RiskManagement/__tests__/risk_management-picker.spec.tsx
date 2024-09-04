import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RiskManagementPicker from '../risk-management-picker';

jest.mock('../deal-cancellation', () => jest.fn(() => <div>Page content 2</div>));
jest.mock('../take-profit-and-stop-loss-container', () => jest.fn(() => <div>Page content 1</div>));

const mock_props = {
    closeActionSheet: jest.fn(),
    should_show_deal_cancellation: true,
};
describe('RiskManagementPicker', () => {
    it('should render Page content 1 component on first page', () => {
        render(<RiskManagementPicker {...mock_props} />);

        expect(screen.getByText('Page content 1')).toBeInTheDocument();
    });

    it('should render Page content 2 component on first page', () => {
        render(<RiskManagementPicker {...mock_props} />);

        userEvent.click(screen.getByText('Deal cancellation'));

        expect(screen.getByText('Page content 2')).toBeInTheDocument();
    });
});
