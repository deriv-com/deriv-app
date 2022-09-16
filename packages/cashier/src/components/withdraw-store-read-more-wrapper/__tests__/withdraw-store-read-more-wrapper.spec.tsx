import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import WithdrawStoreReadMoreWrapper from '../withdraw-store-read-more-wrapper';

describe('<WithdrawStoreReadMoreWrapper />', () => {
    const openDialog = jest.fn();

    it('should render WithdrawStoreReadMoreWrapper component and open dialog on click', () => {
        render(<WithdrawStoreReadMoreWrapper error_content='this is string' openDialog={openDialog} />);

        const read_more_element = screen.getByText('more');
        fireEvent.click(read_more_element);

        expect(openDialog).toHaveBeenCalled();
    });
});
