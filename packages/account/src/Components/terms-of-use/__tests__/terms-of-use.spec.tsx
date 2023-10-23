import React from 'react';
import { render, screen } from '@testing-library/react';
import { isDesktop, isMobile } from '@deriv/shared';
import TermsOfUse from '../terms-of-use';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
}));

describe('<TermsOfUse/>', () => {
    const agree_check = /i agree to the/i;
    const law_title = 'Jurisdiction and choice of law';
    const malta_invest_description =
        'Your account will be opened with Deriv Investments (Europe) Limited, regulated by the Malta Financial Services Authority (MFSA), and will be subject to the laws of Malta.';
    const not_pep_check = 'I am not a PEP, and I have not been a PEP in the last 12 months.';
    const peps_message =
        'A politically exposed person (PEP) is someone appointed with a prominent public position. Close associates and family members of a PEP are also considered to be PEPs.';
    const peps_title = 'Real accounts are not available to politically exposed persons (PEPs).';
    const responsibility_warning_msg =
        'The financial trading services offered on this site are only suitable for customers who accept the possibility of losing all the money they invest and who understand and have experience of the risk involved in the purchase of financial contracts. Transactions in financial contracts carry a high degree of risk. If the contracts you purchased expire as worthless, you will lose all your investment, which includes the contract premium.';
    const risk_warning_title = 'Risk warning';
    const svg_description =
        'Your account will be opened with Deriv (SVG) LLC, and will be subject to the laws of Saint Vincent and the Grenadines.';
    const mock_props: React.ComponentProps<typeof TermsOfUse> = {
        getCurrentStep: jest.fn(),
        goToNextStep: jest.fn(),
        goToPreviousStep: jest.fn(),
        onCancel: jest.fn(),
        onSubmit: jest.fn(),
        real_account_signup_target: 'svg',
        value: { agreed_tos: false, agreed_tnc: false },
    };

    const commonFieldsCheck = () => {
        expect(screen.getByText(agree_check)).toBeInTheDocument();
        expect(screen.getByText(not_pep_check)).toBeInTheDocument();
        expect(screen.getByText(peps_message)).toBeInTheDocument();
        expect(screen.getByText(peps_title)).toBeInTheDocument();
    };

    it('should render TermsOfUse component for svg accounts', () => {
        render(<TermsOfUse {...mock_props} />);

        commonFieldsCheck();
        expect(screen.getByText(law_title)).toBeInTheDocument();
        expect(screen.getByText(responsibility_warning_msg)).toBeInTheDocument();
        expect(screen.getByText(risk_warning_title)).toBeInTheDocument();
        expect(screen.getByText(svg_description)).toBeInTheDocument();
        expect(screen.queryByText(malta_invest_description)).not.toBeInTheDocument();
    });

    it('should render TermsOfUse component for maltainvest accounts and show "Add account" button', () => {
        mock_props.real_account_signup_target = 'maltainvest';

        render(<TermsOfUse {...mock_props} />);

        commonFieldsCheck();
        expect(screen.getByText(law_title)).toBeInTheDocument();
        expect(screen.getByText(malta_invest_description)).toBeInTheDocument();
        expect(screen.getByText(responsibility_warning_msg)).toBeInTheDocument();
        expect(screen.getByText(risk_warning_title)).toBeInTheDocument();
        expect(screen.queryByText(svg_description)).not.toBeInTheDocument();

        const add_btn = screen.getByRole('button', { name: /add account/i });
        expect(add_btn).toBeInTheDocument();
    });

    it('should render TermsOfUse component for maltainvest accounts and show "Add account" button for mobile', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);

        mock_props.real_account_signup_target = 'maltainvest';

        render(<TermsOfUse {...mock_props} />);

        commonFieldsCheck();
        expect(screen.getByText(law_title)).toBeInTheDocument();
        expect(screen.getByText(malta_invest_description)).toBeInTheDocument();
        expect(screen.getByText(responsibility_warning_msg)).toBeInTheDocument();
        expect(screen.getByText(risk_warning_title)).toBeInTheDocument();
        expect(screen.queryByText(svg_description)).not.toBeInTheDocument();

        const add_btn = screen.getByRole('button', { name: /add account/i });
        expect(add_btn).toBeInTheDocument();
    });
});
