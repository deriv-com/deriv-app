import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DynamicLeverageContext } from '../../dynamic-leverage/dynamic-leverage-context';
import JurisdictionModalTitle from '../jurisdiction-modal-title';

type TMockProps = {
    is_dynamic_leverage_visible: boolean;
    toggleDynamicLeverage: React.MouseEventHandler<HTMLSpanElement>;
    account_type: string;
    show_eu_related_content: boolean;
    platform: any;
};

const mock_props = {
    is_dynamic_leverage_visible: false,
    toggleDynamicLeverage: jest.fn(),
    account_type: 'Financial',
    show_eu_related_content: false,
    platform: 'mt5',
};

const JurisdictionModalTitleComponent = ({
    is_dynamic_leverage_visible,
    toggleDynamicLeverage,
    ...mockProps
}: TMockProps) => {
    const dynamic_leverage_value = React.useMemo(
        () => ({ is_dynamic_leverage_visible, toggleDynamicLeverage }),
        [is_dynamic_leverage_visible, toggleDynamicLeverage]
    );
    return (
        <DynamicLeverageContext.Provider value={dynamic_leverage_value}>
            <JurisdictionModalTitle {...mockProps} />
        </DynamicLeverageContext.Provider>
    );
};

describe('JurisdictionModalTitle', () => {
    it('should render JurisdictionModalTitle', () => {
        const new_props = { ...mock_props, platform: 'mt5' };
        render(<JurisdictionModalTitleComponent {...new_props} />);
        const title = screen.getByText(/jurisdiction/);
        expect(title).toBeInTheDocument();
        expect(title).toHaveTextContent('Choose a jurisdiction for your Deriv MT5 Financial account');
    });

    it('should render JurisdictionModalTitle correctly if show_eu_related_content is true', () => {
        const new_props = { ...mock_props, show_eu_related_content: true, platform: 'mt5' };
        render(<JurisdictionModalTitleComponent {...new_props} />);
        const title = screen.getByText(/jurisdiction/);
        expect(title).toBeInTheDocument();
        expect(title).toHaveTextContent('Choose a jurisdiction for your Deriv MT5 CFDs account');
    });

    it('should render JurisdictionModalTitle correctly if show_eu_related_content is true', () => {
        const new_props = { ...mock_props, platform: 'ctrader' };
        render(<JurisdictionModalTitleComponent {...new_props} />);
        const title = screen.getByText(/jurisdiction/);
        expect(title).toBeInTheDocument();
        expect(title).toHaveTextContent('Choose a jurisdiction for your cTrader account');
    });

    it('should render JurisdictionModalTitle correctly if is_dynamic_leverage_visible is true', () => {
        const new_props = { ...mock_props, is_dynamic_leverage_visible: true, platform: 'mt5' };
        render(<JurisdictionModalTitleComponent {...new_props} />);
        const title = screen.getByText(/Deriv/);
        expect(title).toBeInTheDocument();
        expect(title).toHaveTextContent('Get more out of Deriv MT5 Financial');
        const back_button = screen.getByTestId('back_icon');
        expect(back_button).toBeInTheDocument();
        userEvent.click(back_button);
        expect(new_props.toggleDynamicLeverage).toHaveBeenCalled();
    });
});
