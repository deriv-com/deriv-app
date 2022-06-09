import React from "react"
import { render, screen } from '@testing-library/react';
import { Button } from '@deriv/components';
import { PlatformContext } from "@deriv/shared";
import UploadComplete from '../upload-complete'

jest.mock('Components/poa-button', () => () => <div data-testid='dt_poa-button' />)
jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => <div data-testid='dt_mocked_icon' />)
    }
});

const message = /Your proof of identity was submitted successfully/i
const text = /We’ll review your document and notify you of its status within 1 to 2 hours./i
const redirect_button = <Button>Lorem epsom</Button>
const needs_poa_review_message = /Your document is being reviewed, please check back in 1-3 days./i
const needs_poa_extra_submit_message = /You must also submit a proof of address./i

describe('<UploadComplete />', () => {
    const RenderWithTrue = component =>
        render(
            <PlatformContext.Provider value={{ is_appstore: true }}>
                {component}
            </PlatformContext.Provider>
        );

    const RenderWithFalse = component =>
        render(
            <PlatformContext.Provider value={{ is_appstore: false }}>
                {component}
            </PlatformContext.Provider>
        );
    
    it('should display Icon if is_appstore is false', () => {
        RenderWithFalse(<UploadComplete />)
        
        expect(screen.getByTestId(/dt_mocked_icon/)).toBeInTheDocument()
    })

    it('should render <UploadComplete /> component and is_appstore is true', () => {
        RenderWithTrue(<UploadComplete />)

        expect(screen.getByText(message)).toBeInTheDocument()
        expect(screen.getByText(text)).toBeInTheDocument()
        expect(screen.getByTestId(/dt_mocked_icon/)).toBeInTheDocument()
    })

    it('should not show redirect_button if it is not passed', () => {
        RenderWithTrue(<UploadComplete />)
        
        expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('should not show redirect_button if it redirect_button passed and is_from_external is true, but needs_poa is false', () => {
        RenderWithTrue(<UploadComplete is_from_external redirect_button={redirect_button}/>)
        
        expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('should show redirect button if needs_poa and is_from_external are false and have redirect button', () => {
        RenderWithTrue(<UploadComplete redirect_button={redirect_button} />)
        
        expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should show needs_poa review message and extra submission message, and poa_buttons', () => {
        RenderWithTrue(<UploadComplete needs_poa redirect_button={redirect_button} />)

        expect(screen.getByTestId(/dt_poa-button/)).toBeInTheDocument();
        expect(screen.getByText(needs_poa_review_message)).toBeInTheDocument();
        expect(screen.getByText(needs_poa_extra_submit_message)).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    })

    it('should show needs_poa review message and extra submission message, and poa_buttons but redirect_button will not display', () => {
        RenderWithTrue(<UploadComplete needs_poa is_from_external redirect_button={redirect_button} />)

        expect(screen.getByTestId(/dt_poa-button/)).toBeInTheDocument();
        expect(screen.getByText(needs_poa_review_message)).toBeInTheDocument();
        expect(screen.getByText(needs_poa_extra_submit_message)).toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    })
})