import React from 'react';
import ReactDOM from 'react-dom';
import { fireEvent, render, screen ,waitFor} from '@testing-library/react';
import { isDesktop, isMobile } from '@deriv/shared';
import { act } from 'react-dom/test-utils';
import PersonalDetails from '../personal-details';
import { PlatformContext } from '@deriv/shared';
import { BrowserRouter } from 'react-router-dom';

jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isMobile: jest.fn(() =>false),
    isDesktop: jest.fn(() =>true),
}));


const runCommonFormfieldsTests = () => {


    expect(screen.getByRole('radio', { name: /mr/i })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: /ms/i })).toBeInTheDocument();

        expect(screen.getByTestId('first_name')).toBeInTheDocument();
        expect(screen.getByTestId('last_name')).toBeInTheDocument();
       
        expect(screen.getByTestId('date_of_birth')).toBeInTheDocument();

        expect(screen.queryByTestId('place_of_birth')).toBeInTheDocument();
        expect(screen.queryByTestId('place_of_birth_mobile')).not.toBeInTheDocument();
        
        expect(screen.queryByTestId('citizenship')).toBeInTheDocument();
        expect(screen.queryByTestId('citizenship_mobile')).not.toBeInTheDocument();

        expect(screen.queryByTestId('phone')).toBeInTheDocument();

        expect(screen.queryByTestId('tax_residence')).toBeInTheDocument();
        expect(screen.queryByTestId('tax_residence_mobile')).not.toBeInTheDocument();
// 


    expect(screen.getByPlaceholderText(/john/i)).toBeInTheDocument();
    expect(
        screen.getByText(/Please enter your first name as in your official identity documents./i)
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText('Doe')).toBeInTheDocument();
    expect(
        screen.getByText(/Please enter your last name as in your official identity documents./i)
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/01-07-1999/i)).toBeInTheDocument();
    expect(
        screen.getByText(/Please enter your date of birth as in your official identity documents./i)
    ).toBeInTheDocument();

    expect(screen.getByText('Place of birth')).toBeInTheDocument();

    expect(screen.getByText('Citizenship')).toBeInTheDocument();

    expect(screen.getByText('Tax residence')).toBeInTheDocument();

    expect(screen.getByText(/tax identification number/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/tax identification number/i)).toBeInTheDocument();

    expect(
        screen.getByRole('checkbox', {
            name: /i hereby confirm that the tax information i provided is true and complete\. i will also inform deriv investments \(europe\) limited about any changes to this information\./i,
        })
    ).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: /account opening reason/i })).toBeInTheDocument();

    // expect(screen.queryByTestId('account_opening_reason')).toBeInTheDocument();
    expect(screen.queryByTestId('account_opening_reason')).toBeInTheDocument();
    expect(screen.queryByTestId('account_opening_reason_mobile')).not.toBeInTheDocument();


    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
};

describe('<PersonalDetails/>', () => {
    const props = {
        is_svg: true,
        account_opening_reason_list: [
            {
                text: 'Hedging',
                value: 'Hedging',
            },
            {
                text: 'Income Earning',
                value: 'Income Earning',
            },
            {
                text: 'Speculative',
                value: 'Speculative',
            },
        ],
        salutation_list: [
            {
                label: 'Mr',
                value: 'Mr',
            },

            {
                label: 'Ms',
                value: 'Ms',
            },
        ],
        disabled_items: [],
        residence_list: [],
        closeRealAccountSignup: jest.fn(),
        validate:jest.fn(),
        value: {
            account_opening_reason: '',
            salutation: '',
            first_name: '',
            last_name: '',
            date_of_birth: '',
            place_of_birth: '',
            citizen: '',
            phone: '+34',
            tax_residence: '',
            tax_identification_number: '',
            tax_identification_confirm: false,
        },
        index: 1,
        has_currency: true,
        form_error: '',
        bypass_to_personal: false,
    };

    beforeAll(() => {
        ReactDOM.createPortal = jest.fn(component => {
            return component;
        });
    });

    afterAll(() => {
        ReactDOM.createPortal.mockClear();
    });

    const renderwithRouter = component => {
        render(<BrowserRouter>{component}</BrowserRouter>);
    };
    it('should render PersonalDetails component', () => {
        renderwithRouter(<PersonalDetails {...props} />);
        expect(screen.getByTestId('personal-details-form')).toBeInTheDocument();
    });

    it('should show fake-alert message when is_appstore is true', () => {
        renderwithRouter(
            <PlatformContext.Provider value={{ is_appstore: true }}>
                <PersonalDetails {...props} />
            </PlatformContext.Provider>
        );
        expect(
            screen.getByText(
                /we need this for verification\. if the information you provide is fake or inaccurate, you won’t be able to deposit and withdraw\./i
            )
        ).toBeInTheDocument();
    });
    it('should not show fake-alert message when is_appstore is false ', () => {
        renderwithRouter(
            <PlatformContext.Provider value={{ is_appstore: false }}>
                <PersonalDetails {...props} />
            </PlatformContext.Provider>
        );
        expect(
            screen.queryByText(
                /we need this for verification\. if the information you provide is fake or inaccurate, you won’t be able to deposit and withdraw\./i
            )
        ).not.toBeInTheDocument();
    });

    it('should show proper salutation message when is_virtual is true', () => {
        renderwithRouter(<PersonalDetails {...props} is_virtual />);
        expect(
            screen.getByText(
                /please remember that it is your responsibility to keep your answers accurate and up to date\. you can update your personal details at any time in your account settings\./i
            )
        ).toBeInTheDocument();
    });

    it('should show proper salutation message when is_virtual is false', () => {
        renderwithRouter(<PersonalDetails {...props} />);
        expect(
            screen.getByText(
                /please remember that it is your responsibility to keep your answers accurate and up to date\. you can update your personal details at any time in your \./i
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /account settings/i })).toBeInTheDocument();
        expect(screen.getByText(/account settings/i).closest('a')).toHaveAttribute('href', '/account/personal-details');
        fireEvent.click(screen.getByText('account settings'));
        expect(props.closeRealAccountSignup).toHaveBeenCalledTimes(1);
    });

    it('should show title and Name label when salutation is passed', () => {
        renderwithRouter(<PersonalDetails {...props} />);
        expect(
            screen.getByRole('heading', {
                name: /title and name/i,
            })
        ).toBeInTheDocument();
    });
    it('should show Name label when salutation is not passed', () => {
        const newprops = { ...props, value: {} };
        renderwithRouter(<PersonalDetails {...newprops} />);
        expect(screen.getByRole('heading', { name: /name/i })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: /title and name/i })).not.toBeInTheDocument();
    });

    it('should show salutation options', () => {
        renderwithRouter(<PersonalDetails {...props} />);
        const mr_radio_btn = screen.getByRole('radio', { name: /mr/i });
        const mrs_radio_btn = screen.getByRole('radio', { name: /ms/i });
        expect(mr_radio_btn).toBeInTheDocument();
        expect(mrs_radio_btn).toBeInTheDocument();
        expect(mr_radio_btn.checked).toEqual(false);
        fireEvent.click(mr_radio_btn);
        expect(mr_radio_btn.checked).toEqual(true);
        expect(mrs_radio_btn.checked).toEqual(false);
    });

    it('should display the correct field details when is_appstore is true ', () => {
        renderwithRouter(
            <PlatformContext.Provider value={{ is_appstore: true }}>
                <PersonalDetails {...props} is_svg={false} />
            </PlatformContext.Provider>
        );

        expect(screen.getByText(/first name\*/i)).toBeInTheDocument();

        expect(screen.getByText(/family name\*/i)).toBeInTheDocument();

        expect(screen.getByText(/date of birth\*/i)).toBeInTheDocument();

        expect(screen.getByText(/phone number\*/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/phone number\*/i)).toBeInTheDocument();

        runCommonFormfieldsTests();
    });

    it('should display the correct field details when is_appstore is false and is_svg is true ', () => {
        renderwithRouter(
            <PlatformContext.Provider value={{ is_appstore: false }}>
                <PersonalDetails {...props} />
            </PlatformContext.Provider>
        );
        expect(screen.getByRole('heading', { name: /title and name/i })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'name' })).not.toBeInTheDocument();
        expect(screen.getByText(/first name\*/i)).toBeInTheDocument();
        expect(screen.getByText(/last name\*/i)).toBeInTheDocument();
        expect(screen.getByText(/date of birth\*/i)).toBeInTheDocument();
        expect(screen.getByText(/phone number\*/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/phone number\*/i)).toBeInTheDocument();

        runCommonFormfieldsTests();
    });

    it('should display the correct field details when is_appstore is false and is_svg is false ', () => {
        renderwithRouter(
            <PlatformContext.Provider value={{ is_appstore: false }}>
                <PersonalDetails {...props} is_svg={false} />
            </PlatformContext.Provider>
        );
        expect(screen.getByRole('heading', { name: 'Title and name' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'name' })).not.toBeInTheDocument();

        expect(screen.getByRole('heading', { name: /other details/i })).toBeInTheDocument();
        expect(screen.getByText('First name')).toBeInTheDocument();
        expect(screen.getByText('Last name')).toBeInTheDocument();
        expect(screen.getByText('Date of birth')).toBeInTheDocument();
        expect(screen.getByText('Phone number')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Phone number')).toBeInTheDocument();

        runCommonFormfieldsTests();
    });

    it('should not show disabled fields', async () => {
        renderwithRouter(
            <PlatformContext.Provider value={{ is_appstore: false }}>
                <PersonalDetails
                    {...props}
                    disabled_items={[
                        'salutation',
                        'first_name',
                        'last_name',
                        'date_of_birth',
                        'place_of_birth',
                        'citizen',
                        'account_opening_reason',
                    ]}
                />
            </PlatformContext.Provider>
        );

        expect(screen.getByRole('radio', { name: /mr/i })).toBeDisabled();
        expect(screen.getByRole('radio', { name: /ms/i })).toBeDisabled();

        expect(screen.getByTestId('first_name')).toBeDisabled();
        expect(screen.getByTestId('last_name')).toBeDisabled();

        expect(screen.getByTestId('date_of_birth')).toBeDisabled();
        expect(screen.getByTestId('place_of_birth')).toBeDisabled();

        expect(screen.getByTestId('citizenship')).toBeDisabled();
    //     // screen.logTestingPlaygroundURL();
    //     // fireEvent.click(screen.getByTestId('dti_dropdown_display')).toBeC
    //     // expect(screen.getByTestId('dti_dropdown_display')).toBeDisabled();
    //     // screen.debug(undefined, Infinity);
    //     // expect(screen.getByTestId('account_opening_reason_dropdown')).toBeDisabled();
    //     // screen.logTestingPlaygroundURL();
    //     // expect(container.querySelector('dc-dropdown--disabled')).toBeInTheDocument();
    //     // account_opening_reason_dropdown
    });

    it('should display proper data in mobile mode', () => {
        isMobile.mockReturnValue(true);
        isDesktop.mockReturnValue(false);
        renderwithRouter(
            <PlatformContext.Provider value={{ is_appstore: false }}>
                <PersonalDetails {...props} is_svg={false} />
            </PlatformContext.Provider>
        );
        expect(screen.getByRole('radio', { name: /mr/i })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: /ms/i })).toBeInTheDocument();

        expect(screen.getByTestId('first_name')).toBeInTheDocument();
        expect(screen.getByTestId('last_name')).toBeInTheDocument();
       
        expect(screen.getByTestId('date_of_birth')).toBeInTheDocument();

        expect(screen.queryByTestId('place_of_birth_mobile')).toBeInTheDocument();
        expect(screen.queryByTestId('place_of_birth')).not.toBeInTheDocument();

        expect(screen.queryByTestId('citizenship_mobile')).toBeInTheDocument();
        expect(screen.queryByTestId('citizenship')).not.toBeInTheDocument();

        expect(screen.queryByTestId('phone')).toBeInTheDocument();
        expect(screen.queryByTestId('tax_residence_mobile')).toBeInTheDocument();
        expect(screen.queryByTestId('tax_residence')).not.toBeInTheDocument();

        expect(screen.getByText(/tax identification number/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/tax identification number/i)).toBeInTheDocument();

        expect(
            screen.getByRole('checkbox', {
                name: /i hereby confirm that the tax information i provided is true and complete\. i will also inform deriv investments \(europe\) limited about any changes to this information\./i,
            })
        ).toBeInTheDocument();
    
        expect(screen.getByRole('heading', { name: /account opening reason/i })).toBeInTheDocument();


        expect(screen.queryByTestId('account_opening_reason')).not.toBeInTheDocument();
        expect(screen.queryByTestId('account_opening_reason_mobile')).toBeInTheDocument();

    
        expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
    
        expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();

    });


    // it('should have validation error given input field is touched and error exists on form',async()=>{
    //     renderwithRouter(
    //         // <PlatformContext.Provider value={{ is_appstore: false }}>
    //             <PersonalDetails {...props} is_svg={false} />
    //         // </PlatformContext.Provider>
    //     )
    //    const first_name = screen.getByTestId('first_name');

    //    act(() => {
    //     fireEvent.change(first_name, { target: { value: 'abc' } });
    //     // fireEvent.blur(first_name);

    // });


    //    await waitFor(() => {
    //     expect(screen.queryByText('First name should be between 2 and 50 characters.').toBeInTheDocument());
        
    // });


    // })
});
