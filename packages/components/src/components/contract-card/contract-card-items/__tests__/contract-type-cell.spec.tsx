import React from 'react';
import { render, screen } from '@testing-library/react';
import { getContractTypeDisplay, CONTRACT_TYPES } from '@deriv/shared';
import ContractTypeCell from '../contract-type-cell';

jest.mock('../../../icon-trade-types', () => jest.fn(({ type }) => <div>{`Icon trade type: ${type}`}</div>));

describe('<ContractTypeCell />', () => {
    let mock_props: React.ComponentProps<typeof ContractTypeCell>;

    beforeEach(() => {
        mock_props = {
            displayed_trade_param: '',
            getContractTypeDisplay,
            is_high_low: false,
            is_multipliers: false,
            is_turbos: false,
            type: CONTRACT_TYPES.VANILLA.CALL,
        };
    });

    it('should render correct icon and contract type display name', () => {
        render(<ContractTypeCell {...mock_props} />);

        expect(screen.getByText(/vanillalongcall/i)).toBeInTheDocument();
        expect(screen.getByText('Call')).toBeInTheDocument();
    });

    it('should render specific icon postfix _barrier if is_high_low === true and it is not Vanilla contract', () => {
        mock_props.is_high_low = true;
        mock_props.type = CONTRACT_TYPES.LB_CALL;
        render(<ContractTypeCell {...mock_props} />);

        expect(screen.getByText(/lbfloatcall_barrier/i)).toBeInTheDocument();
    });

    it('should render specific contract type display name for Multipliers', () => {
        mock_props.type = CONTRACT_TYPES.MULTIPLIER.DOWN;
        mock_props.is_multipliers = true;
        render(<ContractTypeCell {...mock_props} />);

        expect(screen.getByText('Multipliers')).toBeInTheDocument();
    });

    it('should render specific contract type display name for Turbos', () => {
        mock_props.type = CONTRACT_TYPES.TURBOS.LONG;
        mock_props.is_turbos = true;
        render(<ContractTypeCell {...mock_props} />);

        expect(screen.getByText('Turbos')).toBeInTheDocument();
    });

    it('should not render contract type display name if type is unknown', () => {
        const mock_trade_type = 'MysteriousType';
        mock_props.type = mock_trade_type;
        render(<ContractTypeCell {...mock_props} />);

        expect(screen.queryByText(mock_trade_type)).not.toBeInTheDocument();
    });

    it('should render displayed trade parameters if displayed_trade_param was passed', () => {
        const mock_trade_param = 'Displayed trade parameters';
        mock_props.displayed_trade_param = mock_trade_param;
        render(<ContractTypeCell {...mock_props} />);

        expect(screen.getByText(mock_trade_param)).toBeInTheDocument();
    });
});
