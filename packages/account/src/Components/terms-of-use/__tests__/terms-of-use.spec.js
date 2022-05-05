import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { isDesktop, isMobile, PlatformContext } from '@deriv/shared';
import TermsOfUse from '../terms-of-use';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(),
    isMobile: jest.fn(),
}));

describe('<TermsOfUse/>', () => {
    const malta_description =
        'Your account will be opened with Deriv (Europe) Limited, regulated by the Malta Gaming Authority, and will be subject to the laws of Malta.';
    const malta_invest_description =
        'Your account will be opened with Deriv Investments (Europe) Limited, regulated by the Malta Financial Services Authority (MFSA), and will be subject to the laws of Malta.';
    const responsibility_warning_msg =
        'The financial trading services offered on this site are only suitable for customers who accept the possibility of losing all the money they invest and who understand and have experience of the risk involved in the purchase of financial contracts. Transactions in financial contracts carry a high degree of risk. If the contracts you purchased expire as worthless, you will lose all your investment, which includes the contract premium.';
    const law_title = 'Jurisdiction and choice of law';
    const samoa_description =
        'Your account will be opened with Deriv Capital International Ltd and will be subject to the laws of Samoa.';
    const risk_warning_title = 'Risk warning';
    const peps_title = 'Real accounts are not available to politically exposed persons (PEPs).';
    const peps_message =
        'A politically exposed person (PEP) is someone appointed with a prominent public position. Close associates and family members of a PEP are also considered to be PEPs.';
    const iom_description =
        'Your account will be opened with Deriv (MX) Ltd, regulated by the UK Gaming Commission (UKGC), and will be subject to the laws of the Isle of Man.';

    const svg_description =
        'Your account will be opened with Deriv (SVG) LLC, and will be subject to the laws of Saint Vincent and the Grenadines.';

    const not_pep_check = 'I am not a PEP, and I have not been a PEP in the last 12 months.';
    const agree_check = /i agree to the/i;

    const commonFieldsCheck = () => {
        expect(screen.getByText(peps_title)).toBeInTheDocument();
        expect(screen.getByText(peps_message)).toBeInTheDocument();
    };

    let mock_props;

    beforeEach(() => {
        isDesktop.mockReturnValue(true);
        isMobile.mockReturnValue(false);

        mock_props = {
            getCurrentStep: jest.fn(),
            goToNextStep: jest.fn(),
            goToPreviousStep: jest.fn(),
            onCancel: jest.fn(),
            onSubmit: jest.fn(),
            real_account_signup_target: '',
            value: false,
        };
    });

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

        render(
            <PlatformContext.Provider value={{ is_appstore: false }}>
                <TermsOfUse {...mock_props} />
            </PlatformContext.Provider>
        );

        commonFieldsCheck();
        expect(screen.getByText(law_title)).toBeInTheDocument();
        expect(screen.getByText(malta_invest_description)).toBeInTheDocument();
        expect(screen.getByText(responsibility_warning_msg)).toBeInTheDocument();
        expect(screen.getByText(risk_warning_title)).toBeInTheDocument();

        expect(screen.queryByText(iom_description)).not.toBeInTheDocument();
        expect(screen.queryByText(malta_description)).not.toBeInTheDocument();
        expect(screen.queryByText(samoa_description)).not.toBeInTheDocument();
        expect(screen.queryByText(svg_description)).not.toBeInTheDocument();

        const add_btn = screen.getByText('Add account');
        expect(add_btn).toBeInTheDocument();
    });

    it('should render TermsOfUse component for malta accounts and trigger buttons', () => {
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

        const btns = screen.getAllByRole('button');
        console.log('btns', btns)
        const previous_btn = btns.find(btn => btn.innerText === 'Previous');
        fireEvent.click(previous_btn);
        // expect(mock_props.onCancel).toHaveBeenCalledTimes(1);
        // expect(mock_props.getCurrentStep).toHaveBeenCalledTimes(1);

        // const finish_btn = screen.getByText('Finish');
        // fireEvent.click(finish_btn);

        // console.log('finish_btn', finish_btn);

        // expect(mock_props.onSubmit).toHaveBeenCalledTimes(1)
    });
});
