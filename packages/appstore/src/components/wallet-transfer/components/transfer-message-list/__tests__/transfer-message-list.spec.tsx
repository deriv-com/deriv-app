import React from 'react';
import * as formik from 'formik';
import { render } from '@testing-library/react';
import TransferMessageList from '../transfer-message-list';

const mockUseFormikContext = jest.spyOn(formik, 'useFormikContext') as jest.Mock;

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    MessageList: jest.fn(() => <div>MessageList</div>),
}));

describe('TransferMessageList', () => {
    it('should render MessageList component', () => {
        mockUseFormikContext.mockReturnValue({ errors: { from_amount: [] } });

        render(<TransferMessageList />);
    });
});
