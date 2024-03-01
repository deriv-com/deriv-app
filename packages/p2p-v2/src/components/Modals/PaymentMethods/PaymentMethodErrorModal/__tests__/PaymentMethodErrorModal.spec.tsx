import React, { PropsWithChildren } from 'react';
import { render, screen } from '@testing-library/react';
import PaymentMethodErrorModal from '../PaymentMethodErrorModal';

const wrapper = ({ children }: PropsWithChildren<unknown>) => <div id='v2_modal_root'>{children}</div>;

describe('PaymentMethodErrorModal', () => {
    it('should render the modal correctly', () => {
        const props = {
            errorMessage: 'error message',
            isModalOpen: true,
            onConfirm: jest.fn(),
            title: 'title',
        };
        render(<PaymentMethodErrorModal {...props} />, { wrapper });
        expect(screen.getByText('title')).toBeInTheDocument();
        expect(screen.getByText('error message')).toBeInTheDocument();
    });
});
