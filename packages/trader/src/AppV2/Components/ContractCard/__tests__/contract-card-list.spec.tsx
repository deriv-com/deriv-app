import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TPortfolioPosition } from '@deriv/stores/types';
import { mockContractInfo } from '@deriv/shared';
import ContractCardList from '../contract-card-list';
import ContractCard from '../contract-card';

const contractCard = 'Contract Card';
const cancelButton = 'Cancel';
const closeButton = 'Close';

jest.mock('../contract-card', () =>
    jest.fn(({ onCancel, onClose }: React.ComponentProps<typeof ContractCard>) => (
        <div>
            {contractCard}
            <button onClick={onCancel}>{cancelButton}</button>
            <button onClick={onClose}>{closeButton}</button>
        </div>
    ))
);

const mockProps: React.ComponentProps<typeof ContractCardList> = {
    positions: [
        {
            contract_info: mockContractInfo({
                contract_id: 243585717228,
            }),
        },
        {
            contract_info: mockContractInfo({
                contract_id: 243578583348,
            }),
        },
    ] as TPortfolioPosition[],
};

describe('ContractCardList', () => {
    it('should not render component if positions are empty/not passed', () => {
        const { container } = render(<ContractCardList />);

        expect(container).toBeEmptyDOMElement();
    });
    it('should render component if positions are not empty', () => {
        render(<ContractCardList {...mockProps} />);

        expect(screen.getAllByText(contractCard)).toHaveLength(2);
    });
    it('should call setHasButtonsDemo with false after 720ms if hasButtonsDemo === true', () => {
        const mockedSetHasButtonsDemo = jest.fn();
        jest.useFakeTimers();
        render(<ContractCardList {...mockProps} hasButtonsDemo setHasButtonsDemo={mockedSetHasButtonsDemo} />);

        jest.advanceTimersByTime(720);
        expect(mockedSetHasButtonsDemo).toHaveBeenCalledWith(false);
    });
    it('should call onClickCancel with contract_id when a Cancel button is clicked on a contract card', () => {
        const mockedOnClickCancel = jest.fn();
        render(<ContractCardList {...mockProps} onClickCancel={mockedOnClickCancel} />);

        const firstCardCancelButton = screen.getAllByText(cancelButton)[0];
        userEvent.click(firstCardCancelButton);
        expect(mockedOnClickCancel).toHaveBeenCalledWith(243585717228);
    });
    it('should call onClickSell with contract_id when a Close button is clicked on a contract card', () => {
        const mockedOnClickSell = jest.fn();
        render(<ContractCardList {...mockProps} onClickSell={mockedOnClickSell} />);

        const secondCardCloseButton = screen.getAllByText(closeButton)[1];
        userEvent.click(secondCardCloseButton);
        expect(mockedOnClickSell).toHaveBeenCalledWith(243578583348);
    });
});
