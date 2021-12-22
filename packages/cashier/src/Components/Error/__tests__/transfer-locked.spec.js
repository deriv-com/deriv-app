import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Checklist } from '@deriv/components';
import TransferLocked from '../transfer-locked';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('TransferLocked', () => {
    it('Should show the default lock content for every condition', () => {
        render(<TransferLocked />);
        expect(screen.getByText('Transfers are locked')).toBeInTheDocument();
    });

    it('Should show the financial assessment form', () => {
        render(
            <TransferLocked is_financial_account is_financial_information_incomplete is_trading_experience_incomplete />
        );
        expect(screen.getByText('Complete the financial assessment form')).toBeInTheDocument();
    });

    it('Should trigger click on the checklist item', () => {
        const onClick = jest.fn();
        const items = [
            {
                content: 'Complete the financial assessment form',
                status: 'action',
                onClick: onClick,
            },
        ];
        const wrapper = render(<Checklist className='cashier-locked__checklist' items={items} />);
        const btn = wrapper.container.querySelector('.dc-checklist__item-status--action');

        fireEvent.click(btn);
        expect(onClick).toHaveBeenCalled();
    });
});
