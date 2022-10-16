import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import IdvNoSubmissions from '../idv-limited';

jest.mock('Assets/ic-idv-document-rejected.svg', () => jest.fn(() => 'IdvDocumentRejected'));

describe('<IdvNoSubmissions/>', () => {
    const mockHandleRequireSubmission = jest.fn();

    it('should render IdvNoSubmissions component and trigger click', () => {
        render(<IdvNoSubmissions handleRequireSubmission={mockHandleRequireSubmission} />);

        expect(screen.getByText('IdvDocumentRejected')).toBeInTheDocument();
        expect(screen.getByText(/ID verification failed/i)).toBeInTheDocument();
        expect(screen.getByText(/we were unable to verify your ID with the details you provided/i)).toBeInTheDocument();
        expect(screen.getByText(/please upload your identity document/i)).toBeInTheDocument();

        const btn = screen.getByRole('button');
        expect(btn).toHaveTextContent(/upload identity document/i);
        fireEvent.click(btn);
        expect(mockHandleRequireSubmission).toHaveBeenCalledTimes(1);
    });
});
