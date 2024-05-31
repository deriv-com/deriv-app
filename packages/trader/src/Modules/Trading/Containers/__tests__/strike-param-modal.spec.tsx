import React from 'react';
import ReactDOM from 'react-dom';
import { screen, render } from '@testing-library/react';
import { TRADE_TYPES } from '@deriv/shared';
import StrikeParamModal from '../strike-param-modal';
import userEvent from '@testing-library/user-event';

type TModal = React.FC<{
    children: React.ReactNode;
    is_open: boolean;
    title: string;
}> & {
    Body?: React.FC<{
        children: React.ReactNode;
    }>;
    Footer?: React.FC<{
        children: React.ReactNode;
    }>;
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: false })),
}));

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    const Modal = jest.fn(
        ({ children, is_open, title, toggleModal }) =>
            is_open && (
                <div data-testid='modal'>
                    <h3>{title}</h3>
                    <div onClick={toggleModal}>IcCross</div>
                    {children}
                </div>
            )
    );
    (Modal as TModal).Body = jest.fn(({ children }) => <div>{children}</div>);
    return {
        ...original_module,
        Icon: jest.fn(({ icon, onClick }) => <div onClick={onClick}>{icon}</div>),
        Modal,
    };
});

describe('<StrikeParamModal />', () => {
    const props = {
        contract_type: TRADE_TYPES.VANILLA.CALL,
        is_open: true,
        name: 'barrier_1',
        onChange: jest.fn(),
        strike: '0',
        strike_price_list: [
            { text: '-1', value: '-1' },
            { text: '0', value: '0' },
            { text: '1', value: '1' },
        ],
        toggleModal: jest.fn(),
    };
    beforeAll(() => {
        ReactDOM.createPortal = jest.fn(component => {
            return component as React.ReactPortal;
        });
    });
    afterAll(() => {
        (ReactDOM.createPortal as jest.Mock).mockClear();
    });
    const renderStrikeParamModal = (props: React.ComponentProps<typeof StrikeParamModal>) => {
        return render(
            <div id='modal_root'>
                <StrikeParamModal {...props} />
            </div>
        );
    };
    it('should render StrikeParamModal with strike choices and info icon', () => {
        renderStrikeParamModal(props);
        expect(screen.getByText('Strike')).toBeInTheDocument();
        expect(screen.getByText('-1')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
    });
    it('should not render StrikeParamModal when is_open === false', () => {
        renderStrikeParamModal({ ...props, is_open: false });
        expect(screen.queryByText('Strike')).not.toBeInTheDocument();
        expect(screen.queryByText('-1')).not.toBeInTheDocument();
        expect(screen.queryByText('0')).not.toBeInTheDocument();
        expect(screen.queryByText('1')).not.toBeInTheDocument();
    });
    it('should call onChange with new strike value when user clicks upon another strike option', () => {
        renderStrikeParamModal(props);
        const new_option = screen.getByText('1');
        userEvent.click(new_option);
        expect(props.onChange).toHaveBeenCalledWith(
            expect.objectContaining({
                target: expect.objectContaining({
                    name: 'barrier_1',
                    value: '1',
                }),
            })
        );
    });
    it('should show tooltip when user clicks "info" icon and hide tooltip upon second click', () => {
        window.innerWidth = 720;
        renderStrikeParamModal(props);
        const info_icon = screen.getByTestId('dt_popover_wrapper');

        userEvent.click(info_icon);
        expect(screen.getByText(/If you buy/i)).toBeInTheDocument();

        userEvent.click(info_icon);
        expect(screen.queryByText(/If you buy/i)).not.toBeInTheDocument();
    });
    it('should toggle modal when user closes StrikeParamModal', () => {
        renderStrikeParamModal(props);
        const close_icon = screen.getByText('IcCross');
        userEvent.click(close_icon);
        expect(props.toggleModal).toHaveBeenCalled();
    });
});
