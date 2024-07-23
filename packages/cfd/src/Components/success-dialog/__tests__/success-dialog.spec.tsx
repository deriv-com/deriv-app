import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import SuccessDialog from '../success-dialog';
import { CFDStoreProvider } from '../../../Stores/Modules/CFD/Helpers/useCfdStores';

const mock_store = mockStore({});

const wrapper = ({ children }) => (
    <StoreProvider store={mock_store}>
        <CFDStoreProvider>{children}</CFDStoreProvider>;
    </StoreProvider>
);

describe('<SuccessDialog />', () => {
    it('should render SuccessDialog when is_open is true', () => {
        render(<SuccessDialog is_open={true} />, { wrapper });
        // expect(screen.getBYC('dt_cfd_success_dialog')).toBeInTheDocument();
    });
});
