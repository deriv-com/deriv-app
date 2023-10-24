import React from 'react';
import { render, screen } from '@testing-library/react';
import ContractAuditItem from '../contract-audit-item';

const test_id = 'test_id';
const test_icon = 'test_icon';
const values = {
    value: 'test_value_1',
    value2: 'test_value_2',
};
const mock_default_props = {
    id: test_id,
    label: 'test_label',
    value: values.value,
};

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    formatDate: jest.fn(() => <div>2023-10-11</div>),
    formatTime: jest.fn(() => <div>12:40:45 GMT</div>),
}));

describe('<ContractAuditItem />', () => {
    it('should render component if necessary props were passed', () => {
        render(<ContractAuditItem {...mock_default_props} />);

        expect(screen.getByTestId(test_id)).toBeInTheDocument();
        expect(screen.getByText(values.value)).toBeInTheDocument();
        expect(screen.queryByText(test_icon)).not.toBeInTheDocument();
        expect(screen.queryByText(values.value2)).not.toBeInTheDocument();
    });

    it('should render icon inside component if it was passed', () => {
        render(<ContractAuditItem {...mock_default_props} icon={test_icon} />);

        expect(screen.getByText(test_icon)).toBeInTheDocument();
    });

    it('should render value2 inside component if it was passed', () => {
        render(<ContractAuditItem {...mock_default_props} value2={values.value2} />);

        expect(screen.getByText(values.value2)).toBeInTheDocument();
    });

    it('should render formatDate and formatTime inside component if timestamp was passed', () => {
        render(<ContractAuditItem {...mock_default_props} timestamp={123} />);

        expect(screen.getByText(/2023-10-11/i)).toBeInTheDocument();
        expect(screen.getByText(/12:40:45 GMT/i)).toBeInTheDocument();
    });

    it('should render additional info if additional_info was passed', () => {
        render(<ContractAuditItem {...mock_default_props} additional_info='Additional information' />);

        expect(screen.getByText(/Additional information/i)).toBeInTheDocument();
    });
});
