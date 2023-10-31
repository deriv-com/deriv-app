import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStore } from '@deriv/stores';
import InfoBoxLongcode from '../info-box-longcode';

const test_longcode_short = 'test longcode';
const test_longcode_long =
    'test longcode test longcode test longcode test longcode test longcode test longcode test longcode test longcode test longcode test longcode test longcode test longcode';
const test_longcode_mobile =
    'test longcode test longcode test longcode test longcode test longcode test longcode test longcode test longcode';
const mocked_props = {
    contract_info: { longcode: test_longcode_short, contract_type: 'test' },
};
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: jest.fn(() => 'MockedIcon'),
}));
jest.mock('@deriv/stores', () => ({
    ...jest.requireActual('@deriv/stores'),
    observer: jest.fn(x => x),
    useStore: jest.fn(() => ({
        ui: {
            is_mobile: false,
        },
    })),
}));

describe('InfoBoxLongcode', () => {
    it('should render InfoBoxLongcode component', () => {
        render(<InfoBoxLongcode {...mocked_props} />);

        expect(screen.getByText('MockedIcon')).toBeInTheDocument();
        expect(screen.getByText(test_longcode_short)).toBeInTheDocument();
    });
    it('should not render specific text if longcode is less then 150 symbols', () => {
        render(<InfoBoxLongcode {...mocked_props} />);

        expect(screen.queryByText(/View more/i)).not.toBeInTheDocument();
    });
    it('should render specific text "View more" if longcode is more then 150 symbols', () => {
        mocked_props.contract_info.longcode = test_longcode_long;
        render(<InfoBoxLongcode {...mocked_props} />);

        expect(screen.getByText(/View more/i)).toBeInTheDocument();
    });
    it('should render specific text "View less" if longcode is more then 150 symbols and user click on expand button', () => {
        render(<InfoBoxLongcode {...mocked_props} />);
        userEvent.click(screen.getByText(/View more/i));

        expect(screen.queryByText(/View more/i)).not.toBeInTheDocument();
        expect(screen.getByText(/View less/i)).toBeInTheDocument();
    });
    it('should render specific text "View more" if longcode is more then 47 symbols for mobile', () => {
        (useStore as jest.Mock).mockReturnValue({
            ui: {
                is_mobile: true,
            },
        });
        mocked_props.contract_info.longcode = test_longcode_mobile;
        render(<InfoBoxLongcode {...mocked_props} />);

        expect(screen.getByText(/View more/i)).toBeInTheDocument();
    });
    it('should render modal if longcode is more then 47 symbols for mobile and user clicks on "View more" button', () => {
        (useStore as jest.Mock).mockReturnValue({
            ui: {
                is_mobile: true,
            },
        });
        mocked_props.contract_info.longcode = test_longcode_mobile;
        render(<InfoBoxLongcode {...mocked_props} />);
        userEvent.click(screen.getByText(/View more/i));

        expect(screen.getByText(/Trade info/i)).toBeInTheDocument();
        expect(screen.getByText(/Ok/i)).toBeInTheDocument();
    });
});
