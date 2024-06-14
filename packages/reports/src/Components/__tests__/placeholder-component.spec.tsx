import React from 'react';
import { render, screen } from '@testing-library/react';
import PlaceholderComponent from '../placeholder-component';
import EmptyTradeHistoryMessage from 'Components/empty-trade-history-message';

describe('PlaceholderComponent', () => {
    it('should not render component without props', () => {
        const { container } = render(<PlaceholderComponent />);

        expect(container).toBeEmptyDOMElement();
    });

    it('should render loader if is_loading === true', () => {
        render(<PlaceholderComponent is_loading />);

        expect(screen.getByTestId('dt_loading_component')).toBeInTheDocument();
    });

    it('should render passed component (as empty_message_component prop) if is_empty === true', () => {
        const mockProps = {
            component_icon: 'icon',
            empty_message_component: EmptyTradeHistoryMessage,
            is_empty: true,
            localized_message: 'localized message',
            localized_period_message: 'localized period message',
        };
        render(<PlaceholderComponent {...mockProps} />);

        expect(screen.getByTestId('dt_empty_trade_history_icon')).toBeInTheDocument();
        expect(screen.getByText('localized message')).toBeInTheDocument();
    });
});
