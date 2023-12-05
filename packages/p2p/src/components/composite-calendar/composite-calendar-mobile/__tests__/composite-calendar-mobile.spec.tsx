import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatePicker, MobileDialog } from '@deriv/components';
import CompositeCalendarMobile from '../composite-calendar-mobile';

const mock_props = {
    duration_list: [
        { value: 'all_time', label: 'All time', onClick: jest.fn() },
        { value: 'last_7_days', label: 'Last 7 days', onClick: jest.fn() },
        { value: 'last_30_days', label: 'Last 30 days' },
        { value: 'last_365_days', label: 'Last 365 days' },
    ],
    from: 1696319493,
    to: 1696319494,
    onChange: jest.fn(),
};

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    InputField: jest.fn(({ onClick }) => (
        <div onClick={onClick} onKeyDown={onClick}>
            Input Field
        </div>
    )),
    MobileDialog: jest.fn(({ children }) => <div>{children}</div>),
    DatePicker: jest.fn(({ onChange }) => <div onChange={onChange}>DatePicker</div>),
}));

describe('CompositeCalendarMobile', () => {
    let modal_root_el: HTMLElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });
    it('should render the component', () => {
        render(<CompositeCalendarMobile {...mock_props} />);
        expect(screen.getByText('Input Field')).toBeInTheDocument();
    });
    it('should open the mobile dialog on clicking the calendar field', () => {
        render(<CompositeCalendarMobile {...mock_props} />);
        userEvent.click(screen.getByText('Input Field'));
        expect(screen.getByText('Custom')).toBeInTheDocument();
    });
    it('should close the modal on close click', async () => {
        render(<CompositeCalendarMobile {...mock_props} />);
        userEvent.click(screen.getByText('Input Field'));
        act(() => {
            (MobileDialog as jest.Mock).mock.calls[0][0].onClose();
        });
        expect(MobileDialog).toHaveBeenLastCalledWith(expect.objectContaining({ visible: false }), {});
    });
    it('should handle applydaterange function', () => {
        render(<CompositeCalendarMobile {...mock_props} />);
        userEvent.click(screen.getByText('Input Field'));
        act(() => {
            (MobileDialog as jest.Mock).mock.calls[0][0].footer.props.applyDateRange();
        });
        expect(mock_props.onChange).toHaveBeenCalled();
    });
    it('should handle DatePicker onChange function with from date', () => {
        render(<CompositeCalendarMobile {...mock_props} />);
        userEvent.click(screen.getByText('Input Field'));
        act(() => {
            (DatePicker as unknown as jest.Mock).mock.calls[0][0].onChange({ target: { value: '2021-09-01' } }, 'from');
        });
    });
});
