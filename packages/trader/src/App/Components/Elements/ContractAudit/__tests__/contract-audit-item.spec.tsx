import React from 'react';
import { render, screen } from '@testing-library/react';
import ContractAuditItem from '../contract-audit-item';

const test_id = 'test_id';

const mock_default_props = {
    id: test_id,
    label: 'test_label',
    value: <div>test_value_1</div>,
};

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    formatDate: jest.fn(() => <div>formatDate</div>),
    formatTime: jest.fn(() => <div>formatTime</div>),
}));

describe('<ContractAuditItem />', () => {
    it('should render component if nessesary props were pased', () => {
        render(<ContractAuditItem {...mock_default_props} />);

        expect(screen.getByTestId(test_id)).toBeInTheDocument();
        expect(screen.getByText(/test_value_1/i)).toBeInTheDocument();
        expect(screen.queryByText(/test_icon/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/test_value_2/i)).not.toBeInTheDocument();
    });

    it('should render icon inside component if it was passed', () => {
        render(<ContractAuditItem {...mock_default_props} icon={<div>test_icon</div>} />);

        expect(screen.getByText(/test_icon/i)).toBeInTheDocument();
    });

    it('should render value2 inside component if it was passed', () => {
        render(<ContractAuditItem {...mock_default_props} value2={<div>test_value_2</div>} />);

        expect(screen.getByText(/test_value_2/i)).toBeInTheDocument();
    });

    it('should render formatDate and formatTime inside component if it was passed', () => {
        render(<ContractAuditItem {...mock_default_props} timestamp={123} />);

        expect(screen.getByText(/formatDate/i)).toBeInTheDocument();
        expect(screen.getByText(/formatTime/i)).toBeInTheDocument();
    });
});
