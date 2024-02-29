import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyProfileAdDetails from '../MyProfileAdDetails';

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <AuthProvider>
            <div id='v2_modal_root' />
            {children}
        </AuthProvider>
    </APIProvider>
);

const mockUseAdvertiserInfo = {
    data: {},
    isLoading: true,
};

const mockMutateAdvertiser = jest.fn();
const mockUseUpdateAdvertiser = {
    data: {
        contact_info: '',
        default_advert_description: '',
    },
    isLoading: false,
    mutate: mockMutateAdvertiser,
};
const mockUseDevice = {
    isMobile: false,
};
const mockSetQueryString = jest.fn();

jest.mock('@/hooks/useDevice', () => ({
    __esModule: true,
    default: jest.fn(() => mockUseDevice),
}));
jest.mock('@/hooks/useQueryString', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        setQueryString: mockSetQueryString,
    })),
}));

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    p2p: {
        advertiser: {
            useGetInfo: jest.fn(() => mockUseAdvertiserInfo),
            useUpdate: jest.fn(() => mockUseUpdateAdvertiser),
        },
    },
}));

describe('MyProfileBalance', () => {
    it('should render the loader when initial data is fetching', () => {
        render(<MyProfileAdDetails />, { wrapper });
        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
        mockUseAdvertiserInfo.isLoading = false;
    });
    it('should render initial default details when user has not updated their details yet', () => {
        mockUseAdvertiserInfo.data = {};
        render(<MyProfileAdDetails />, { wrapper });
        const contactTextAreaNode = screen.getByTestId('dt_p2p_v2_profile_ad_details_contact');
        expect(within(contactTextAreaNode).getByRole('textbox')).toHaveValue('');
        const descriptionTextAreaNode = screen.getByTestId('dt_p2p_v2_profile_ad_details_description');
        expect(within(descriptionTextAreaNode).getByRole('textbox')).toHaveValue('');
    });
    it('should render initial empty details when user has not updated their details yet', () => {
        mockUseAdvertiserInfo.data = {
            contact_info: '',
            default_advert_description: '',
        };
        render(<MyProfileAdDetails />, { wrapper });
        const contactTextAreaNode = screen.getByTestId('dt_p2p_v2_profile_ad_details_contact');
        expect(within(contactTextAreaNode).getByRole('textbox')).toHaveValue('');
        const descriptionTextAreaNode = screen.getByTestId('dt_p2p_v2_profile_ad_details_description');
        expect(within(descriptionTextAreaNode).getByRole('textbox')).toHaveValue('');
    });
    it('should render initial details when user has previously updated their details', () => {
        mockUseAdvertiserInfo.data = {
            contact_info: '0123456789',
            default_advert_description: 'mock description',
        };
        render(<MyProfileAdDetails />, { wrapper });
        const contactTextAreaNode = screen.getByTestId('dt_p2p_v2_profile_ad_details_contact');
        expect(within(contactTextAreaNode).getByRole('textbox')).toHaveValue('0123456789');
        const descriptionTextAreaNode = screen.getByTestId('dt_p2p_v2_profile_ad_details_description');
        expect(within(descriptionTextAreaNode).getByRole('textbox')).toHaveValue('mock description');
    });
    it('should render and post updated details when user updates their details', () => {
        mockUseAdvertiserInfo.data = {
            contact_info: '0123456789',
            default_advert_description: 'mock description',
        };
        render(<MyProfileAdDetails />, { wrapper });
        const contactTextBoxNode = within(screen.getByTestId('dt_p2p_v2_profile_ad_details_contact')).getByRole(
            'textbox'
        );
        const descriptionTextBoxNode = within(screen.getByTestId('dt_p2p_v2_profile_ad_details_description')).getByRole(
            'textbox'
        );
        const submitBtn = screen.getByRole('button', {
            name: 'Save',
        });
        // tests by default if not edited, button should be disabled
        expect(submitBtn).toBeDisabled();
        userEvent.type(contactTextBoxNode, '0');
        userEvent.type(descriptionTextBoxNode, ' here');
        expect(submitBtn).toBeEnabled();

        userEvent.click(submitBtn);
        expect(mockMutateAdvertiser).toBeCalledWith({
            contact_info: '01234567890',
            default_advert_description: 'mock description here',
        });
    });
    it('should render mobile screen', () => {
        mockUseDevice.isMobile = true;
        render(<MyProfileAdDetails />, { wrapper });
        const contactTextBoxNode = within(screen.getByTestId('dt_p2p_v2_profile_ad_details_contact')).getByRole(
            'textbox'
        );
        const descriptionTextBoxNode = within(screen.getByTestId('dt_p2p_v2_profile_ad_details_description')).getByRole(
            'textbox'
        );
        expect(contactTextBoxNode).toBeInTheDocument();
        expect(descriptionTextBoxNode).toBeInTheDocument();

        const goBackBtn = screen.getByTestId('dt_p2p_v2_mobile_wrapper_button');
        userEvent.click(goBackBtn);
        expect(mockSetQueryString).toBeCalledWith({
            tab: 'default',
        });
    });
});
