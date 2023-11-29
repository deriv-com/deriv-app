import React from 'react';
import { render, screen } from '@testing-library/react';
import Popover from '../popover';
import { StoreProvider, mockStore } from '@deriv/stores';
import Icon from '../../icon';
import userEvent from '@testing-library/user-event';
import { TCoreStores } from '@deriv/stores/types';

const default_mocked_props = {
    alignment: 'right',
    className: 'test-tooltip',
    classNameBubble: 'test-popover',
    icon: 'info',
    id: 'test_popover',
    is_bubble_hover_enabled: true,
    message: 'Information about item.',
    onBubbleClose: jest.fn(),
    onBubbleOpen: jest.fn(),
    zIndex: '9999',
} as React.ComponentProps<typeof Popover>;

jest.mock('../../icon', () =>
    jest.fn((props: React.ComponentProps<typeof Icon>) => <div data-testid='mocked_icon'>{props.icon}</div>)
);

describe('<Popover/>', () => {
    const mockPopover = (mocked_props = default_mocked_props, mocked_store: TCoreStores = mockStore({})) => {
        return (
            <StoreProvider store={mocked_store}>
                <Popover {...mocked_props}>Children</Popover>
            </StoreProvider>
        );
    };
    it('should render an info icon, display tooltip on hover/click, hide only after unfocusing in desktop', () => {
        render(mockPopover());
        const info_icon = screen.getByText('IcInfoOutline');
        expect(info_icon).toBeInTheDocument();
        expect(screen.queryByText('Information about item.')).not.toBeInTheDocument();
        userEvent.hover(info_icon);
        expect(screen.getByText('IcInfoBlue')).toBeInTheDocument();
        expect(screen.getByText('Information about item.')).toBeInTheDocument();
        userEvent.click(info_icon);
        expect(screen.getByText('IcInfoBlue')).toBeInTheDocument();
        expect(screen.getByText('Information about item.')).toBeInTheDocument();
        userEvent.unhover(info_icon);
        expect(screen.queryByText('IcInfoBlue')).not.toBeInTheDocument();
        expect(screen.queryByText('Information about item.')).not.toBeInTheDocument();
    });
    it('should render a question icon, display tooltip upon tap & hide it upon the second tap on mobile', () => {
        render(mockPopover({ ...default_mocked_props, icon: 'question' }, mockStore({ ui: { is_mobile: true } })));
        const unknown_icon = screen.getByText('IcUnknown');
        expect(unknown_icon).toBeInTheDocument();
        expect(screen.queryByText('Information about item.')).not.toBeInTheDocument();
        userEvent.click(unknown_icon);
        expect(screen.queryByText('IcInfoBlue')).not.toBeInTheDocument();
        expect(screen.getByText('Information about item.')).toBeInTheDocument();
        userEvent.click(unknown_icon);
        expect(screen.queryByText('Information about item.')).not.toBeInTheDocument();
    });
    it('should render controlled popover with open tooltip when is_open === true & should call onClick when target is tapped', () => {
        const onClick = jest.fn();
        render(
            mockPopover({
                ...default_mocked_props,
                icon: 'dot',
                is_open: true,
                onClick,
            })
        );
        const circle_icon = screen.getByText('IcCircle');
        expect(circle_icon).toBeInTheDocument();
        expect(screen.getByText('Information about item.')).toBeInTheDocument();
        userEvent.click(circle_icon);
        expect(onClick).toBeCalled();
    });
    it('should display an error message', () => {
        render(
            mockPopover({
                ...default_mocked_props,
                is_open: true,
                onClick: jest.fn(),
                has_error: true,
                message: 'Error message.',
            })
        );
        expect(screen.getByText('Error message.')).toBeInTheDocument();
    });
    it('should render a counter', () => {
        render(mockPopover({ ...default_mocked_props, icon: 'counter', counter: 5 }));
        expect(screen.getByText('5')).toBeInTheDocument();
    });
    it('should disable the target icon', () => {
        render(mockPopover({ ...default_mocked_props, disable_target_icon: true, icon: 'info' }));
        expect(screen.queryByText('IcInfoOutline')).not.toBeInTheDocument();
        expect(screen.getByText('Children')).toBeInTheDocument();
    });
    it('should disable the icon inside the tooltip', () => {
        render(
            mockPopover({
                ...default_mocked_props,
                disable_message_icon: true,
                icon: 'info',
                is_open: true,
                onClick: jest.fn(),
            })
        );
        expect(screen.getByText('IcInfoOutline')).toBeInTheDocument();
        expect(screen.queryByText('IcInfoBlue')).not.toBeInTheDocument();
    });
});
