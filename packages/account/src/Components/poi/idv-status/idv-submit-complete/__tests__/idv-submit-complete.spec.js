import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import IdvSubmitComplete from '../idv-submit-complete';

jest.mock('Assets/ic-idv-document-pending.svg', () => jest.fn(() => 'IdvDocumentPending'));

describe('<IdvSubmitComplete/>', () => {
    const mock_props = {
        needs_poa: false,
        is_from_external: false,
    };

    const commonRenderCheck = () => {
        expect(screen.getByText('IdvDocumentPending')).toBeInTheDocument();
        expect(screen.getByText('Your ID number was submitted successfully')).toBeInTheDocument();
        expect(
            screen.getByText("We'll process your details within a few minutes and notify its status via email.")
        ).toBeInTheDocument();
    };
    it('should render IdvSubmitComplete component not external, no needs_poa', () => {
        render(<IdvSubmitComplete {...mock_props} />);

        commonRenderCheck();
        expect(screen.queryByText("Next, we'll need your proof of address.")).not.toBeInTheDocument();
        expect(screen.queryByText('Submit proof of address')).not.toBeInTheDocument();
    });
    it('should render IdvSubmitComplete component not external, needs_poa', () => {
        mock_props.needs_poa = true;

        render(
            <BrowserRouter>
                <IdvSubmitComplete {...mock_props} />
            </BrowserRouter>
        );

        commonRenderCheck();
        expect(screen.getByText("Next, we'll need your proof of address.")).toBeInTheDocument();
        expect(screen.getByText('Submit proof of address')).toBeInTheDocument();
    });
    it('should render IdvSubmitComplete component external, needs_poa', () => {
        mock_props.needs_poa = true;
        mock_props.is_from_external = true;

        render(
            <BrowserRouter>
                <IdvSubmitComplete {...mock_props} />
            </BrowserRouter>
        );

        commonRenderCheck();
        expect(screen.getByText("Next, we'll need your proof of address.")).toBeInTheDocument();
        expect(screen.queryByText('Submit proof of address')).not.toBeInTheDocument();
    });
});
