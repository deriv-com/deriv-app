import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { isDesktop, isMobile, PlatformContext } from '@deriv/shared';
import TermsOfUse from '../terms-of-use';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
}));

describe('<TermsOfUse/>', () => {
    const agree_check = /i agree to the/i;
    const iom_description =
        'Your account will be opened with Deriv (MX) Ltd, regulated by the UK Gaming Commission (UKGC), and will be subject to the laws of the Isle of Man.';
    const law_title = 'Jurisdiction and choice of law';
    const malta_description =
        'Your account will be opened with Deriv (Europe) Limited, regulated by the Malta Gaming Authority, and will be subject to the laws of Malta.';
    const malta_invest_description =
        'Your account will be opened with Deriv Investments (Europe) Limited, regulated by the Malta Financial Services Authority (MFSA), and will be subject to the laws of Malta.';
    const not_pep_check = 'I am not a PEP, and I have not been a PEP in the last 12 months.';
    const peps_message =
        'A politically exposed person (PEP) is someone appointed with a prominent public position. Close associates and family members of a PEP are also considered to be PEPs.';
    const peps_title = 'Real accounts are not available to politically exposed persons (PEPs).';
    const responsibility_warning_msg =
        'The financial trading services offered on this site are only suitable for customers who accept the possibility of losing all the money they invest and who understand and have experience of the risk involved in the purchase of financial contracts. Transactions in financial contracts carry a high degree of risk. If the contracts you purchased expire as worthless, you will lose all your investment, which includes the contract premium.';
    const risk_warning_title = 'Risk warning';
    const samoa_description =
        'Your account will be opened with Deriv Capital International Ltd and will be subject to the laws of Samoa.';
    const svg_description =
        'Your account will be opened with Deriv (SVG) LLC, and will be subject to the laws of Saint Vincent and the Grenadines.';

    const mock_props = {
        getCurrentStep: jest.fn(),
        goToNextStep: jest.fn(),
        goToPreviousStep: jest.fn(),
        onCancel: jest.fn(),
        onSubmit: jest.fn(),
        real_account_signup_target: '',
        value: { agreed_tos: false, agreed_tnc: false },
    };

    const commonFieldsCheck = () => {
        expect(screen.getByText(agree_check)).toBeInTheDocument();
        expect(screen.getByText(not_pep_check)).toBeInTheDocument();
        expect(screen.getByText(peps_message)).toBeInTheDocument();
        expect(screen.getByText(peps_title)).toBeInTheDocument();
    };

    it('should render TermsOfUse component for svg accounts', () => {
        mock_props.real_account_signup_target = 'svg';

        render(<TermsOfUse {...mock_props} />);

        commonFieldsCheck();
        expect(screen.getByText(law_title)).toBeInTheDocument();
        expect(screen.getByText(responsibility_warning_msg)).toBeInTheDocument();
        expect(screen.getByText(risk_warning_title)).toBeInTheDocument();
        expect(screen.getByText(svg_description)).toBeInTheDocument();

        expect(screen.queryByText(iom_description)).not.toBeInTheDocument();
        expect(screen.queryByText(malta_description)).not.toBeInTheDocument();
        expect(screen.queryByText(malta_invest_description)).not.toBeInTheDocument();
        expect(screen.queryByText(samoa_description)).not.toBeInTheDocument();
    });

    it('should render TermsOfUse component for iom accounts', () => {
        mock_props.real_account_signup_target = 'iom';

        render(<TermsOfUse {...mock_props} />);

        commonFieldsCheck();
        expect(screen.getByText(iom_description)).toBeInTheDocument();
        expect(screen.getByText(law_title)).toBeInTheDocument();

        expect(screen.queryByText(malta_description)).not.toBeInTheDocument();
        expect(screen.queryByText(malta_invest_description)).not.toBeInTheDocument();
        expect(screen.queryByText(responsibility_warning_msg)).not.toBeInTheDocument();
        expect(screen.queryByText(risk_warning_title)).not.toBeInTheDocument();
        expect(screen.queryByText(samoa_description)).not.toBeInTheDocument();
        expect(screen.queryByText(svg_description)).not.toBeInTheDocument();
    });

    it('should render TermsOfUse component for samoa accounts', () => {
        mock_props.real_account_signup_target = 'samoa';

        render(<TermsOfUse {...mock_props} />);

        commonFieldsCheck();
        expect(screen.getByText(law_title)).toBeInTheDocument();
        expect(screen.getByText(responsibility_warning_msg)).toBeInTheDocument();
        expect(screen.getByText(risk_warning_title)).toBeInTheDocument();
        expect(screen.getByText(samoa_description)).toBeInTheDocument();

        expect(screen.queryByText(iom_description)).not.toBeInTheDocument();
        expect(screen.queryByText(malta_description)).not.toBeInTheDocument();
        expect(screen.queryByText(malta_invest_description)).not.toBeInTheDocument();
        expect(screen.queryByText(svg_description)).not.toBeInTheDocument();
    });

    it('should render TermsOfUse component for maltainvest accounts and show "Add account" button', () => {
        mock_props.real_account_signup_target = 'maltainvest';

        render(<TermsOfUse {...mock_props} />);

        commonFieldsCheck();
        expect(screen.getByText(law_title)).toBeInTheDocument();
        expect(screen.getByText(malta_invest_description)).toBeInTheDocument();
        expect(screen.getByText(responsibility_warning_msg)).toBeInTheDocument();
        expect(screen.getByText(risk_warning_title)).toBeInTheDocument();

        expect(screen.queryByText(iom_description)).not.toBeInTheDocument();
        expect(screen.queryByText(malta_description)).not.toBeInTheDocument();
        expect(screen.queryByText(samoa_description)).not.toBeInTheDocument();
        expect(screen.queryByText(svg_description)).not.toBeInTheDocument();

        const add_btn = screen.getByRole('button', { name: /add account/i });
        expect(add_btn).toBeInTheDocument();
    });

    it('should render TermsOfUse component for maltainvest accounts and show "Add account" button for mobile', () => {
        isMobile.mockReturnValue(true);
        isDesktop.mockReturnValue(false);

        mock_props.real_account_signup_target = 'maltainvest';

        render(<TermsOfUse {...mock_props} />);

        commonFieldsCheck();
        expect(screen.getByText(law_title)).toBeInTheDocument();
        expect(screen.getByText(malta_invest_description)).toBeInTheDocument();
        expect(screen.getByText(responsibility_warning_msg)).toBeInTheDocument();
        expect(screen.getByText(risk_warning_title)).toBeInTheDocument();

        expect(screen.queryByText(iom_description)).not.toBeInTheDocument();
        expect(screen.queryByText(malta_description)).not.toBeInTheDocument();
        expect(screen.queryByText(samoa_description)).not.toBeInTheDocument();
        expect(screen.queryByText(svg_description)).not.toBeInTheDocument();

        const add_btn = screen.getByRole('button', { name: /add account/i });
        expect(add_btn).toBeInTheDocument();
    });

    it('should render TermsOfUse component for malta accounts and trigger buttons', async () => {
        mock_props.real_account_signup_target = 'malta';

        render(
            <PlatformContext.Provider value={{ is_appstore: true }}>
                <TermsOfUse {...mock_props} />
            </PlatformContext.Provider>
        );

        commonFieldsCheck();
        expect(screen.getByText(law_title)).toBeInTheDocument();
        expect(screen.getByText(malta_description)).toBeInTheDocument();

        expect(screen.queryByText(iom_description)).not.toBeInTheDocument();
        expect(screen.queryByText(malta_invest_description)).not.toBeInTheDocument();
        expect(screen.queryByText(responsibility_warning_msg)).not.toBeInTheDocument();
        expect(screen.queryByText(risk_warning_title)).not.toBeInTheDocument();
        expect(screen.queryByText(samoa_description)).not.toBeInTheDocument();
        expect(screen.queryByText(svg_description)).not.toBeInTheDocument();

        const previous_btn = screen.getByRole('button', { name: /previous/i });
        fireEvent.click(previous_btn);
        expect(mock_props.getCurrentStep).toHaveBeenCalledTimes(1);
        expect(mock_props.onCancel).toHaveBeenCalledTimes(1);

        const agree_checkbox = screen.getByLabelText(agree_check);
        const not_pep_checkbox = screen.getByLabelText(not_pep_check);
        expect(agree_checkbox.checked).toBeFalsy();
        expect(not_pep_checkbox.checked).toBeFalsy();

        fireEvent.click(agree_checkbox);
        fireEvent.click(not_pep_checkbox);
        expect(agree_checkbox.checked).toBeTruthy();
        expect(not_pep_checkbox.checked).toBeTruthy();

        const finish_btn = screen.getByRole('button', { name: /finish/i });

        fireEvent.click(finish_btn);
        await waitFor(() => {
            expect(mock_props.getCurrentStep).toHaveBeenCalledTimes(2);
            expect(mock_props.onSubmit).toHaveBeenCalledTimes(1);
        });
    });
});
