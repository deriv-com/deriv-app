import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ONFIDO_ERROR_STATUS } from '@deriv/shared';
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
        expect(screen.getByText(ONFIDO_ERROR_STATUS.DataValidationExpiryDate.message)).toBeInTheDocument();
        expect(screen.getByText(ONFIDO_ERROR_STATUS.DataValidationDocumentExpiration.message)).toBeInTheDocument();

        const btn = screen.getByRole('button');
        fireEvent.click(btn);
        expect(mockHandleRequireSubmission).toHaveBeenCalledTimes(1);
    });
});
