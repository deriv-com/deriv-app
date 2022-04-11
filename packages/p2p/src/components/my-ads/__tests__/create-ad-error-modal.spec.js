import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import { useStores } from 'Stores';
import CreateAdErrorModal from '../create-ad-error-modal.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

const mocked_my_ads_store = {
    is_api_error_modal_visible: true,
    setIsApiErrorModalVisible: jest.fn(),
};

const modal_root_el = document.createElement('div');

describe('<CreateAdErrorModal />', () => {
    beforeAll(() => {
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });
    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('Should render default header if no error_code, func should be called when click on `ok` button', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: mocked_my_ads_store,
        }));
        render(<CreateAdErrorModal />);

        const el_dp2p_create_ad_error_modal_header = screen.getByText("Something's not right");
        expect(el_dp2p_create_ad_error_modal_header).toBeInTheDocument();

        const el_dp2p_create_ad_error_modal_button = screen.getByRole('button');
        fireEvent.click(el_dp2p_create_ad_error_modal_button);
        expect(mocked_my_ads_store.setIsApiErrorModalVisible).toHaveBeenCalledWith(false);
    });

    it('Should render proper error header and description depends on error_code, func should be called when click on `ok` button', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: {
                ...mocked_my_ads_store,
                create_ad_error_code: 'DuplicateAdvert',
            },
        }));
        render(<CreateAdErrorModal />);

        const el_dp2p_create_ad_error_modal_header = screen.getByText('You already have an ad with this rate');
        const el_dp2p_create_ad_error_modal_description = screen.getByText(
            'You already have an ad with the same exchange rate for this currency pair and order type. Please set a different rate for your ad.'
        );

        expect(el_dp2p_create_ad_error_modal_header).toBeInTheDocument();
        expect(el_dp2p_create_ad_error_modal_description).toBeInTheDocument();

        const el_dp2p_create_ad_error_modal_button = screen.getByRole('button');
        fireEvent.click(el_dp2p_create_ad_error_modal_button);

        expect(mocked_my_ads_store.setIsApiErrorModalVisible).toHaveBeenCalledWith(false);
    });

    it('Should render proper error header and description depends on error_code, func should be called when click on `ok` button', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: {
                ...mocked_my_ads_store,
                create_ad_error_code: 'AdvertSameLimits',
            },
        }));
        render(<CreateAdErrorModal />);

        const el_dp2p_create_ad_error_modal_header = screen.getByText('You already have an ad with this range');
        const el_dp2p_create_ad_error_modal_description = screen.getByText(
            'Please set a different minimum and/or maximum order limit. The range of your ad should not overlap with any of your active ads.'
        );

        expect(el_dp2p_create_ad_error_modal_header).toBeInTheDocument();
        expect(el_dp2p_create_ad_error_modal_description).toBeInTheDocument();

        const el_dp2p_create_ad_error_modal_button = screen.getByRole('button');
        fireEvent.click(el_dp2p_create_ad_error_modal_button);

        expect(mocked_my_ads_store.setIsApiErrorModalVisible).toHaveBeenCalledWith(false);
    });
});
