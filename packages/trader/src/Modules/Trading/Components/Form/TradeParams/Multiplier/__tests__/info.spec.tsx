import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import MultipliersInfo from '../info';
import TraderProviders from '../../../../../../../trader-providers';

const commission = 'Commission';
const stop_out = 'Stop out';
const commission_tooltip_text = /0.0440%/i;
const stop_out_tooltip_text = /your contract will be closed automatically when your loss reaches/i;

describe('<MultipliersInfo />', () => {
    let default_mocked_store: ReturnType<typeof mockStore>,
        default_mocked_props: React.ComponentProps<typeof MultipliersInfo>;

    beforeEach(() => {
        default_mocked_store = {
            ...mockStore({}),
            modules: {
                trade: {
                    currency: 'USD',
                    has_stop_loss: false,
                    multiplier: 10,
                    amount: 100,
                    commission: 0.44,
                    stop_out: 5,
                },
            },
        };
        default_mocked_props = {
            amount: 100,
            className: 'mocked_classname',
            commission_text_size: '14',
            commission: 0.44,
            is_tooltip_relative: true,
            multiplier: 10,
            should_show_tooltip: true,
            stop_out_text_size: '14',
            stop_out: 5,
        };
    });

    const mockMultipliersInfo = () => {
        return (
            <TraderProviders store={default_mocked_store}>
                <MultipliersInfo {...default_mocked_props} />
            </TraderProviders>
        );
    };

    it('should render commission text with popover and stop out text with popover', () => {
        render(mockMultipliersInfo());

        expect(screen.getAllByTestId('dt_popover_wrapper')).toHaveLength(2);

        const commission_block = screen.getByText(commission);
        expect(commission_block).toBeInTheDocument();
        expect(screen.getByText(/0.44 USD/i)).toBeInTheDocument();

        expect(screen.queryByText(commission_tooltip_text)).not.toBeInTheDocument();
        userEvent.hover(commission_block);
        expect(screen.getByText(commission_tooltip_text)).toBeInTheDocument();

        const stop_out_block = screen.getByText(stop_out);
        expect(stop_out_block).toBeInTheDocument();
        expect(screen.getByText(/5.00 USD/i)).toBeInTheDocument();

        expect(screen.queryByText(stop_out_tooltip_text)).not.toBeInTheDocument();
        userEvent.hover(stop_out_block);
        expect(screen.getByText(stop_out_tooltip_text)).toBeInTheDocument();
    });
    it('should not render stop out text with popover if has_stop_loss === true', () => {
        default_mocked_store.modules.trade.has_stop_loss = true;
        render(mockMultipliersInfo());

        expect(screen.queryByText(stop_out)).not.toBeInTheDocument();
        expect(screen.queryByText(/5.00 USD/i)).not.toBeInTheDocument();
    });
    it('should not render tooltips if should_show_tooltip === false', () => {
        default_mocked_props.should_show_tooltip = false;
        render(mockMultipliersInfo());

        expect(screen.queryByTestId('dt_popover_wrapper')).not.toBeInTheDocument();
    });
    it('should render commission text and stop out text even if they were not passed in props (fallback from store should work)', () => {
        default_mocked_props = { className: 'mocked_classname' };
        render(mockMultipliersInfo());

        expect(screen.getByText(commission)).toBeInTheDocument();
        expect(screen.getByText(/0.44 USD/i)).toBeInTheDocument();

        expect(screen.getByText(stop_out)).toBeInTheDocument();
        expect(screen.getByText(/5.00 USD/i)).toBeInTheDocument();
    });
    it('should render zero values for commission text and stop out text if they were not passed in props and fallback is falsy', () => {
        default_mocked_props = { className: 'mocked_classname' };
        default_mocked_store.modules.trade = {};
        render(mockMultipliersInfo());

        expect(screen.getByText(commission)).toBeInTheDocument();
        expect(screen.getByText(stop_out)).toBeInTheDocument();
        expect(screen.getAllByText(/0.00 USD/i)).toHaveLength(2);
    });
});
