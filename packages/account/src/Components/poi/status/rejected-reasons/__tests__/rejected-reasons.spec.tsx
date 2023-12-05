import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { RejectedReasons } from '../rejected-reasons';

describe('<RejectedReasons />', () => {
    it('should render RejectedReasons with rejected reasons and trigger continue ', () => {
        const mockHandleRequireSubmission = jest.fn();
        const rejected_reasons = ['DataValidationExpiryDate', 'DataValidationDocumentExpiration'];

        const store_config = mockStore({});

        render(
            <StoreProvider store={store_config}>
                <RejectedReasons
                    handleRequireSubmission={mockHandleRequireSubmission}
                    rejected_reasons={rejected_reasons}
                />
            </StoreProvider>
        );

        expect(screen.getByTestId('dt_icon_message_list')).toBeInTheDocument();
        expect(
            screen.getByText('Some details on your document appear to be invalid, missing, or unclear.')
        ).toBeInTheDocument();
        expect(screen.getByText('Your document has expired.')).toBeInTheDocument();

        const btn = screen.getByRole('button');
        fireEvent.click(btn);
        expect(mockHandleRequireSubmission).toHaveBeenCalledTimes(1);
    });
});
