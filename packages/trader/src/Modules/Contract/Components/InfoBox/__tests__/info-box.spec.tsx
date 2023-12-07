import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockContractInfo } from '@deriv/shared';
import InfoBox from '../info-box';

const test_longcode = 'test longcode';
const test_contract_type = 'test contract type';
const mocked_props = {
    contract_info: mockContractInfo({ longcode: '', contract_type: '' }),
    error_message: 'some error',
    removeError: jest.fn(),
};

jest.mock('../info-box-longcode.tsx', () => jest.fn(() => <div>{test_longcode}</div>));

describe('InfoBox', () => {
    it('should not render the component if longcode field in contract_info is falsy', () => {
        const { container } = render(<InfoBox {...mocked_props} />);

        expect(container).toBeEmptyDOMElement();
    });
    it('should render the component if longcode field in contract_info is not falsy', () => {
        mocked_props.contract_info.longcode = test_longcode;
        const { container } = render(<InfoBox {...mocked_props} />);

        expect(container).not.toBeEmptyDOMElement();
    });
    it('should render the proper text from longcode if contract_type and longcode fields are not falsy', () => {
        mocked_props.contract_info.contract_type = test_contract_type;
        render(<InfoBox {...mocked_props} />);

        expect(screen.getByText(test_longcode)).toBeInTheDocument();
    });
    it('should render error_message text if contract_type, longcode and error_message fields are not falsy', () => {
        render(<InfoBox {...mocked_props} />);

        expect(screen.getByText(/some error/i)).toBeInTheDocument();
    });
});
