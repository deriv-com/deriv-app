import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getCardLabels } from '@deriv/shared';
import ToggleCardDialog from '../toggle-card-dialog';

const contractUpdateForm = 'ContractUpdateForm';

jest.mock('../contract-update-form', () => jest.fn(() => <div>ContractUpdateForm</div>));
jest.mock('../../../icon', () => jest.fn((props: { icon: string }) => <div>{props.icon}</div>));

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
    it('should not render ContractUpdateForm when edit icon is clicked if is_valid_to_cancel === true', () => {
        render(<ToggleCardDialog {...mockProps} is_valid_to_cancel />);
        expect(screen.queryByText(contractUpdateForm)).not.toBeInTheDocument();
        const editIcon = screen.getByText('IcEdit');
        userEvent.click(editIcon);
        expect(screen.queryByText(contractUpdateForm)).not.toBeInTheDocument();
    });
});
