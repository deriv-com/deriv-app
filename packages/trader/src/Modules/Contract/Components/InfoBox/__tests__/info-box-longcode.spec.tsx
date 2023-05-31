import React from 'react';
import { render, screen } from '@testing-library/react';
import InfoBoxLongcode from '../info-box-longcode';

const test_contract_type_call = 'VANILLALONGCALL';
const test_contract_type_put = 'VANILLALONGPUT';
const mocked_props = {
    contract_info: { longcode: 'test longcode', contract_type: 'test' },
};
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: jest.fn(() => 'MockedIcon'),
}));

describe('InfoBoxLongcode', () => {
    it('should render InfoBoxLongcode component', () => {
        render(<InfoBoxLongcode {...mocked_props} />);

        expect(screen.getByText('MockedIcon')).toBeInTheDocument();
        expect(screen.getByText('test longcode')).toBeInTheDocument();
    });
    it('should render the specific text if contract_type is vanillas call', () => {
        mocked_props.contract_info.contract_type = test_contract_type_call;
        render(<InfoBoxLongcode {...mocked_props} />);

        expect(screen.getByText(/for call/i)).toBeInTheDocument();
    });
    it('should render the specific text if contract_type is vanillas put', () => {
        mocked_props.contract_info.contract_type = test_contract_type_put;
        render(<InfoBoxLongcode {...mocked_props} />);

        expect(screen.getByText(/for put/i)).toBeInTheDocument();
    });
});
