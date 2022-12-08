import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RejectedReasons } from '../rejected-reasons';

describe('<RejectedReasons />', () => {
    it('should render RejectedReasons with rejected reasons and trigger continue ', () => {
        const mockHandleRequireSubmission = jest.fn();
        const rejected_reasons = ['Reason 1', 'Reason 2'];

        render(
            <RejectedReasons
                handleRequireSubmission={mockHandleRequireSubmission}
                rejected_reasons={rejected_reasons}
            />
        );

        expect(screen.getByTestId('dt_icon_message_list')).toBeInTheDocument();
        expect(screen.getByText('Reason 1')).toBeInTheDocument();
        expect(screen.getByText('Reason 2')).toBeInTheDocument();

        const btn = screen.getByRole('button');
        fireEvent.click(btn);
        expect(mockHandleRequireSubmission).toHaveBeenCalledTimes(1);
    });
});
