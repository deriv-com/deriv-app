import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getCardLabels } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import ToggleCardDialog from '../toggle-card-dialog';

const contractUpdateForm = 'ContractUpdateForm';

jest.mock('../contract-update-form', () => jest.fn(() => <div>ContractUpdateForm</div>));
jest.mock('../../../icon', () => jest.fn((props: { icon: string }) => <div>{props.icon}</div>));
jest.mock('@deriv-com/ui', () => ({
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    isDesktop: jest.fn(() => true),
}));

describe('ToggleCardDialog', () => {
    const mockProps = {
        addToast: jest.fn(),
        contract_id: 1,
        current_focus: null,
        error_message_alignment: 'left',
        getCardLabels: () => getCardLabels(),
        getContractById: jest.fn(),
        is_valid_to_cancel: false,
        onMouseLeave: jest.fn(),
        removeToast: jest.fn(),
        setCurrentFocus: jest.fn(),
        totalProfit: 50,
    };
    beforeAll(() => {
        (ReactDOM.createPortal as jest.Mock) = jest.fn(component => {
            return component;
        });
    });
    afterAll(() => {
        (ReactDOM.createPortal as jest.Mock).mockClear();
    });
    it('should render ContractUpdateForm when edit icon is clicked', () => {
        render(<ToggleCardDialog {...mockProps} />);
        expect(screen.queryByText(contractUpdateForm)).not.toBeInTheDocument();
        const editIcon = screen.getByText('IcEdit');
        userEvent.click(editIcon);
        expect(screen.getByText(contractUpdateForm)).toBeInTheDocument();
    });
    it('should not render ContractUpdateForm when edit icon is clicked if is_risk_management_edition_disabled === true', () => {
        render(<ToggleCardDialog {...mockProps} is_risk_management_edition_disabled />);
        expect(screen.queryByText(contractUpdateForm)).not.toBeInTheDocument();
        const editIcon = screen.getByText('IcEdit');
        userEvent.click(editIcon);
        expect(screen.queryByText(contractUpdateForm)).not.toBeInTheDocument();
    });
    it('should call addToast with specific text content if should_show_warning && is_risk_management_edition_disabled === true and it is mobile device', () => {
        (useDevice as jest.Mock).mockImplementation(() => ({ isDesktop: false, isMobile: true }));
        render(<ToggleCardDialog {...mockProps} is_risk_management_edition_disabled should_show_warning />);
        const editIcon = screen.getByRole('button');
        userEvent.click(editIcon);

        expect(mockProps.addToast).toBeCalledWith({
            key: 'risk_management_is_disabled',
            content: getCardLabels().TAKE_PROFIT_LOSS_NOT_AVAILABLE,
            type: 'error',
        });
    });
    it('should call addToast with specific text content if should_show_warning && is_risk_management_edition_disabled && is_accumulator === true and it is mobile device', () => {
        render(
            <ToggleCardDialog {...mockProps} is_risk_management_edition_disabled should_show_warning is_accumulator />
        );
        const editIcon = screen.getByRole('button');
        userEvent.click(editIcon);

        expect(mockProps.addToast).toBeCalledWith({
            key: 'risk_management_is_disabled',
            content: getCardLabels().TAKE_PROFIT_IS_NOT_AVAILABLE,
            type: 'error',
        });
    });
});
