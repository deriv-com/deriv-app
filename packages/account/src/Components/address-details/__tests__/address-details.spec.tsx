import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AddressDetails from '../address-details';
import { isDesktop, isMobile, PlatformContext, TLocationList } from '@deriv/shared';
import { FormikProps, FormikValues } from 'formik';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getLocation: jest.fn().mockReturnValue('Default test state'),
    isDesktop: jest.fn(),
    isMobile: jest.fn(),
    makeCancellablePromise: jest.fn(() => ({ cancel: jest.fn(), promise: Promise.resolve('resolved') })),
}));

jest.mock('../../real-account-signup/helpers/utils.js', () => ({
    splitValidationResultTypes: jest.fn(() => ({
        errors: {},
        warnings: {},
    })),
}));

describe('<AddressDetails/>', () => {
    const address_line_1 = 'First line of address';
    const address_line_1_marked = 'First line of address*';
    const address_line_2 = 'Second line of address';
    const address_line_2_marked = 'Second line of address*';
    const address_postcode = 'Postal/ZIP Code';
    const address_postcode_marked = 'Postal/ZIP Code*';
    const address_state = 'State/Province';
    const address_town = 'Town/City';
    const address_town_marked = 'Town/City*';
    const use_address_info = /only use an address for which you have proof of residence/i;
    const verification_info =
        'We need this for verification. If the information you provide is fake or inaccurate, you won’t be able to deposit and withdraw.';

    let modal_root_el: HTMLDivElement;

    const mock_props: React.ComponentProps<typeof AddressDetails> = {
        fetchStatesList: jest.fn(() => Promise.resolve([])),
        getCurrentStep: jest.fn(),
        goToNextStep: jest.fn(),
        goToPreviousStep: jest.fn(),
        is_gb_residence: '',
        is_svg: true,
        onCancel: jest.fn(),
        onSave: jest.fn(),
        onSubmit: jest.fn(),
        onSubmitEnabledChange: jest.fn(),
        selected_step_ref: { current: { isSubmitting: false } } as React.RefObject<FormikProps<FormikValues>>,
        states_list: [],
        value: {
            address_city: '',
            address_line_1: '',
            address_line_2: '',
            address_postcode: '',
            address_state: 'Default test state',
        },
        validate: jest.fn(),
        disabled_items: [],
    };

    const svgCommonRenderCheck = () => {
        expect(mock_props.onSubmitEnabledChange).toHaveBeenCalledTimes(1);
        expect(screen.getByLabelText(address_line_1_marked)).toBeInTheDocument();
        expect(screen.getByLabelText(address_line_2)).toBeInTheDocument();
        expect(screen.getByLabelText(address_postcode)).toBeInTheDocument();
        expect(screen.getByLabelText(address_state)).toBeInTheDocument();
        expect(screen.getByLabelText(address_town_marked)).toBeInTheDocument();
        expect(screen.getByText(use_address_info)).toBeInTheDocument();

        expect(screen.queryByLabelText(address_line_1)).not.toBeInTheDocument();
        expect(screen.queryByLabelText(address_line_2_marked)).not.toBeInTheDocument();
        expect(screen.queryByLabelText(address_postcode_marked)).not.toBeInTheDocument();
        expect(screen.queryByLabelText(address_town)).not.toBeInTheDocument();
    };

    beforeEach(() => {
        (isDesktop as jest.Mock).mockReturnValue(true);
        (isMobile as jest.Mock).mockReturnValue(false);
        jest.clearAllMocks();
    });

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render AddressDetails component for mobile', async () => {
        (isDesktop as jest.Mock).mockReturnValue(false);
        (isMobile as jest.Mock).mockReturnValue(true);

        render(<AddressDetails {...mock_props} />);

        await waitFor(() => {
            svgCommonRenderCheck();
        });
        expect(screen.queryByText(verification_info)).not.toBeInTheDocument();

        const inputs: HTMLTextAreaElement[] = screen.getAllByRole('textbox');
        expect(inputs.length).toBe(5);
        const required_fields = inputs.filter(input => input.required === true);
        expect(required_fields.length).toBe(2);
    });

    it('should render AddressDetails component and trigger buttons', async () => {
        render(<AddressDetails {...mock_props} />);

        await waitFor(() => {
            svgCommonRenderCheck();
        });
        expect(screen.queryByText(verification_info)).not.toBeInTheDocument();

        const inputs: HTMLTextAreaElement[] = screen.getAllByRole('textbox');
        expect(inputs.length).toBe(5);

        const required_fields = inputs.filter(input => input.required === true);
        expect(required_fields.length).toBe(2);

        const previous_btn = screen.getByRole('button', { name: /previous/i });
        fireEvent.click(previous_btn);
        expect(mock_props.getCurrentStep).toHaveBeenCalledTimes(1);
        expect(mock_props.onCancel).toHaveBeenCalledTimes(1);
        expect(mock_props.onSave).toHaveBeenCalledTimes(1);

        const address_line_1_input: HTMLInputElement = screen.getByPlaceholderText(address_line_1);
        const first_line_adress_text = 'Test first line address';
        expect(address_line_1_input.value).toBe('');
        fireEvent.change(address_line_1_input, { target: { value: first_line_adress_text } });
        await waitFor(() => {
            expect(address_line_1_input.value).toBe(first_line_adress_text);
        });

        const address_town_input: HTMLInputElement = screen.getByPlaceholderText(address_town);
        const address_town_text = 'Test city';
        expect(address_town_input.value).toBe('');
        fireEvent.change(address_town_input, { target: { value: address_town_text } });
        await waitFor(() => {
            expect(address_town_input.value).toBe(address_town_text);
        });

        const address_postcode_input: HTMLInputElement = screen.getByPlaceholderText(address_postcode);
        const address_postcode_text = 'Test postcode';
        expect(address_postcode_input.value).toBe('');
        fireEvent.change(address_postcode_input, { target: { value: address_postcode_text } });
        await waitFor(() => {
            expect(address_postcode_input.value).toBe(address_postcode_text);
        });

        const address_state_input: HTMLInputElement = screen.getByPlaceholderText(address_state);
        const address_state_text = 'Test state';
        expect(address_state_input.value).toBe('Default test state');
        fireEvent.change(address_state_input, { target: { value: address_state_text } });
        await waitFor(() => {
            expect(address_state_input.value).toBe(address_state_text);
        });

        const next_btn = screen.getByRole('button', { name: /next/i });
        fireEvent.click(next_btn);
        await waitFor(() => {
            expect(mock_props.getCurrentStep).toHaveBeenCalledTimes(2);
            expect(mock_props.onSubmit).toHaveBeenCalledTimes(1);
        });
    });

    it('should render AddressDetails component not svg', async () => {
        mock_props.is_svg = false;

        render(<AddressDetails {...mock_props} />);

        expect(mock_props.onSubmitEnabledChange).toHaveBeenCalledTimes(1);

        const inputs: HTMLTextAreaElement[] = screen.getAllByRole('textbox');
        expect(inputs.length).toBe(5);
        const required_fields = inputs.filter(input => input.required === true);
        expect(required_fields.length).toBe(0);

        await waitFor(() => {
            expect(screen.getByLabelText(address_line_1)).toBeInTheDocument();
            expect(screen.getByLabelText(address_line_2)).toBeInTheDocument();
            expect(screen.getByLabelText(address_postcode)).toBeInTheDocument();
            expect(screen.getByLabelText(address_state)).toBeInTheDocument();
            expect(screen.getByLabelText(address_town)).toBeInTheDocument();
            expect(screen.getByText(use_address_info)).toBeInTheDocument();
        });

        expect(screen.queryByText(address_line_1_marked)).not.toBeInTheDocument();
        expect(screen.queryByText(address_line_2_marked)).not.toBeInTheDocument();
        expect(screen.queryByText(address_postcode_marked)).not.toBeInTheDocument();
        expect(screen.queryByText(address_town_marked)).not.toBeInTheDocument();
        expect(screen.queryByText(verification_info)).not.toBeInTheDocument();
    });

    it('should render AddressDetails component for appstore', async () => {
        render(
            <PlatformContext.Provider value={{ is_appstore: true, is_deriv_crypto: false, is_pre_appstore: false }}>
                <AddressDetails {...mock_props} />
            </PlatformContext.Provider>
        );

        expect(mock_props.onSubmitEnabledChange).toHaveBeenCalledTimes(1);
        await waitFor(() => {
            expect(screen.getByText(verification_info)).toBeInTheDocument();
        });
        expect(screen.queryByText(use_address_info)).not.toBeInTheDocument();

        const inputs: HTMLTextAreaElement[] = screen.getAllByRole('textbox');
        expect(inputs.length).toBe(5);

        const required_fields = inputs.filter(input => input.required === true);
        expect(required_fields.length).toBe(4);

        expect(screen.getByLabelText(address_line_1_marked)).toBeInTheDocument();
        expect(screen.getByLabelText(address_line_2_marked)).toBeInTheDocument();
        expect(screen.getByLabelText(address_postcode_marked)).toBeInTheDocument();
        expect(screen.getByLabelText(address_state)).toBeInTheDocument();
        expect(screen.getByLabelText(address_town_marked)).toBeInTheDocument();
        expect(screen.getByText(verification_info)).toBeInTheDocument();

        expect(screen.queryByText(address_line_1)).not.toBeInTheDocument();
        expect(screen.queryByText(address_line_2)).not.toBeInTheDocument();
        expect(screen.queryByText(address_postcode)).not.toBeInTheDocument();
        expect(screen.queryByText(address_town)).not.toBeInTheDocument();
        expect(screen.queryByText(use_address_info)).not.toBeInTheDocument();
    });

    it('should render AddressDetails component with states_list for mobile', async () => {
        (isDesktop as jest.Mock).mockReturnValue(false);
        (isMobile as jest.Mock).mockReturnValue(true);

        mock_props.states_list = [
            { text: 'State 1', value: 'State 1' },
            { text: 'State 2', value: 'State 2' },
        ] as TLocationList[];

        render(<AddressDetails {...mock_props} />);

        expect(screen.getByText('Default test state')).toBeInTheDocument();

        const address_state_input: HTMLInputElement = screen.getByRole('combobox');
        expect(address_state_input.value).toBe('');
        fireEvent.change(address_state_input, { target: { value: 'State 2' } });
        await waitFor(() => {
            expect(address_state_input.value).toBe('State 2');
        });
    });

    it('should render AddressDetails component with states_list for desktop', async () => {
        mock_props.states_list = [
            { text: 'State 1', value: 'State 1' },
            { text: 'State 2', value: 'State 2' },
        ] as TLocationList[];

        render(<AddressDetails {...mock_props} />);

        const address_state_input: HTMLTextAreaElement = screen.getByRole('textbox', { name: 'State/Province' });
        expect(address_state_input).toHaveValue('Default test state');
        fireEvent.change(address_state_input, { target: { value: 'State 1' } });
        await waitFor(() => {
            expect(address_state_input.value).toBe('State 1');
        });
    });

    it('should disable the field if it is immuatble from BE', async () => {
        mock_props.disabled_items = ['address_line_1', 'address_line_2'];
        mock_props.value.address_state = '';

        render(<AddressDetails {...mock_props} />);

        expect(screen.getByPlaceholderText(address_line_1)).toBeDisabled();
        expect(screen.getByPlaceholderText(address_line_2)).toBeDisabled();
        await waitFor(() => {
            expect(screen.getByRole('textbox', { name: 'State/Province' })).toBeEnabled();
        });
        expect(screen.getByPlaceholderText(address_town)).toBeEnabled();
        expect(screen.getByPlaceholderText(address_postcode)).toBeEnabled();
    });
});
