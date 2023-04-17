import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import IdvRejected from '../idv-rejected';

jest.mock('Assets/ic-idv-document-rejected.svg', () => jest.fn(() => 'IdvDocumentRejected'));

describe('<IdvRejected/>', () => {
    const mockHandleRequireSubmission = jest.fn();

    it('should render IdvRejected component and trigger click', () => {
        render(<IdvRejected handleRequireSubmission={mockHandleRequireSubmission} />);

        expect(screen.getByText('IdvDocumentRejected')).toBeInTheDocument();
        expect(screen.getByText(/ID verification failed/i)).toBeInTheDocument();
        expect(screen.getByText(/we were unable to verify your ID with the details you provided/i)).toBeInTheDocument();

        const btn = screen.getByRole('button');
        expect(btn).toHaveTextContent(/try again/i);
        fireEvent.click(btn);
        expect(mockHandleRequireSubmission).toHaveBeenCalledTimes(1);
    });
});
