import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TRADE_TYPES } from '@deriv/shared';
import { hasCallPutEqual } from 'Stores/Modules/Trading/Helpers/allow-equals';
import AllowEquals from '../allow-equals';

const default_props = {
    contract_start_type: 'spot',
    contract_type: TRADE_TYPES.RISE_FALL,
    contract_types_list: {},
    duration_unit: 'd',
    expiry_type: 'endtime',
    onChange: jest.fn(),
    value: 1,
    has_equals_only: false,
} as React.ComponentProps<typeof AllowEquals>;

jest.mock('Stores/Modules/Trading/Helpers/allow-equals', () => ({
    ...jest.requireActual('Stores/Modules/Trading/Helpers/allow-equals'),
    hasCallPutEqual: jest.fn().mockReturnValue(true),
}));

describe('<AllowEquals />', () => {
    it('should render component if it is not RiseFallEqual and hasCallPutEqual returns false', () => {
        (hasCallPutEqual as jest.Mock).mockReturnValueOnce(false);
        const { container } = render(<AllowEquals {...default_props} />);

        expect(container).toBeEmptyDOMElement();
    });
    it('should render Allow equals checkbox with popover if it is RiseFallEqual and hasCallPutEqual returns true', () => {
        render(<AllowEquals {...default_props} />);

        expect(screen.getByText('Allow equals')).toBeInTheDocument();
        expect(screen.getByTestId('dt_popover_wrapper')).toBeInTheDocument();
    });
    it('should call onChange function if user clicked on checkbox', () => {
        render(<AllowEquals {...default_props} />);

        expect(default_props.onChange).not.toBeCalled();
        userEvent.click(screen.getByRole('checkbox'));

        expect(default_props.onChange).toBeCalled();
    });
});
