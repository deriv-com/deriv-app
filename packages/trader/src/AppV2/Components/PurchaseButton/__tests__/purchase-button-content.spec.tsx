import React from 'react';
import { render, screen } from '@testing-library/react';
import { getLocalizedBasis } from '@deriv/shared';
import PurchaseButtonContent from '../purchase-button-content';

type TInfo = React.ComponentProps<typeof PurchaseButtonContent>['info'];

const mock_props = {
    currency: 'USD',
    current_stake: 12,
    has_open_accu_contract: false,
    info: {
        has_error: false,
        has_error_details: false,
        obj_contract_basis: {
            text: 'Payout',
            value: 19.23,
        },
        payout: 19.23,
        profit: '9.23',
    } as TInfo,
    is_accumulator: false,
    is_multiplier: false,
    is_touch: false,
    is_turbos: false,
    is_vanilla: false,
    is_vanilla_fx: false,
    is_reverse: false,
};
const wrapper_data_test_id = 'dt_purchase_button_wrapper';
const localized_basis = getLocalizedBasis();

describe('PurchaseButtonContent', () => {
    it('should render empty wrapper with specific className if info prop is empty object or falsy', () => {
        render(<PurchaseButtonContent {...mock_props} info={{} as TInfo} />);

        expect(screen.getByTestId(wrapper_data_test_id)).toHaveClass(
            'purchase-button__information__wrapper--disabled-placeholder'
        );
        expect(screen.queryByText(mock_props.currency)).not.toBeInTheDocument();
    });

    it('should render correct default text basis and amount if info was passed', () => {
        render(<PurchaseButtonContent {...mock_props} />);

        expect(screen.getByTestId(wrapper_data_test_id)).not.toHaveClass(
            'purchase-button__information__wrapper--disabled-placeholder'
        );
        expect(screen.getByText(localized_basis.payout)).toBeInTheDocument();
        expect(screen.getByText(/19.23/)).toBeInTheDocument();
        expect(screen.getByText(/USD/i)).toBeInTheDocument();
    });

    it('should apply specific className to wrapper when is_reverse is true', () => {
        render(<PurchaseButtonContent {...mock_props} is_reverse />);

        expect(screen.getByTestId(wrapper_data_test_id)).toHaveClass('purchase-button__information__wrapper--reverse');
    });

    it('should render correct specific text basis and amount for Multipliers', () => {
        const multipliers_info = {
            has_error: false,
            has_error_details: false,
            obj_contract_basis: {
                text: '',
                value: '',
            },
            stake: '10.00',
        };
        render(<PurchaseButtonContent {...mock_props} is_multiplier info={multipliers_info as TInfo} />);

        expect(screen.getByText(localized_basis.stake)).toBeInTheDocument();
        expect(screen.getByText(/10/)).toBeInTheDocument();
        expect(screen.getByText(/USD/i)).toBeInTheDocument();
    });

    it('should not render text basis and amount for Accumulators (when there is no open contract and with it)', () => {
        const accumulators_info = {
            has_error: false,
            has_error_details: false,
            obj_contract_basis: {
                text: '',
                value: '',
            },
            maximum_payout: 4000,
        };
        const { rerender } = render(
            <PurchaseButtonContent {...mock_props} is_accumulator info={accumulators_info as TInfo} />
        );

        expect(screen.queryByText(localized_basis.max_payout)).not.toBeInTheDocument();
        expect(screen.queryByText(/4,000.00/)).not.toBeInTheDocument();
        expect(screen.queryByText(/USD/i)).not.toBeInTheDocument();

        rerender(
            <PurchaseButtonContent
                {...mock_props}
                is_accumulator
                info={accumulators_info as TInfo}
                has_open_accu_contract
            />
        );

        expect(screen.getByText(localized_basis.current_stake)).toBeInTheDocument();
        expect(screen.getByText(/12/)).toBeInTheDocument();
        expect(screen.getByText(/USD/i)).toBeInTheDocument();
    });

    it('should not render text basis and amount for Turbos', () => {
        const turbos_info = {
            has_error: false,
            has_error_details: false,
            obj_contract_basis: {
                text: 'Payout per point',
                value: '8.250455',
            },
        };
        render(<PurchaseButtonContent {...mock_props} is_turbos info={turbos_info as TInfo} />);

        expect(screen.queryByText(localized_basis.payout_per_point)).not.toBeInTheDocument();
        expect(screen.queryByText(/8.250455/)).not.toBeInTheDocument();
        expect(screen.queryByText(/USD/i)).not.toBeInTheDocument();
    });

    it('should not render text basis and amount for Vanilla (not fx and fx)', () => {
        const vanilla_info = {
            has_error: false,
            has_error_details: false,
            obj_contract_basis: {
                text: 'Payout per point',
                value: '12.77095',
            },
        };
        const { rerender } = render(<PurchaseButtonContent {...mock_props} is_vanilla info={vanilla_info as TInfo} />);

        expect(screen.queryByText(localized_basis.payout_per_point)).not.toBeInTheDocument();
        expect(screen.queryByText(/12.77095/)).not.toBeInTheDocument();
        expect(screen.queryByText(/USD/i)).not.toBeInTheDocument();

        rerender(<PurchaseButtonContent {...mock_props} is_vanilla is_vanilla_fx info={vanilla_info as TInfo} />);

        expect(screen.queryByText(localized_basis.payout_per_pip)).not.toBeInTheDocument();
        expect(screen.queryByText(/12.77095/)).not.toBeInTheDocument();
        expect(screen.queryByText(/USD/i)).not.toBeInTheDocument();
    });
});
