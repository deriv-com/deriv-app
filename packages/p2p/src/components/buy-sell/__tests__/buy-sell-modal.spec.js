import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { isMobile } from '@deriv/shared';
import { useStores } from 'Stores';
import BuySellModal from '../buy-sell-modal.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isMobile: jest.fn(() => false),
}));

const setShouldShowPopup = jest.fn();
const setOrderId = jest.fn();
const redirectTo = jest.fn();

const props = {
    selected_ad: {
        account_currency: 'USD',
    },
    setShouldShowPopup,
    should_show_popup: true,
};

describe('<BuySellModal />', () => {
    beforeAll(() => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });
    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const mockedUseStores = useStores.mockImplementation(() => ({
        advertiser_page_store: {
            setFormErrorMessage: jest.fn(),
        },
        buy_sell_store: {
            advert: {
                advertiser_details: {
                    name: 'test'
                },
                description: '',
            },
            form_props: {
                setIsSubmitDisabled: jest.fn(),
                setSubmitForm: jest.fn(),
            },
            is_sell_advert: false,
            setFormProps: jest.fn(),
            setInitialReceiveAmount: jest.fn(),
        },
        general_store: {
            nickname: 'test',
            props: {
                modal_root_id: '123',
            },
            redirectTo,
        },
        order_store: {
            setOrderId,
        }
    }));

    beforeAll(() => mockedUseStores());

    it('Proper component should be rendered on desktop view', () => {
        render(<BuySellModal {...props} />);

        expect(screen.getByTestId('dp2p-buy-sell-modal_container')).toBeInTheDocument();
    });

    it('Proper component should be rendered on mobile view', () => {
        isMobile.mockReturnValue(true)
        render(<BuySellModal {...props} />);

        expect(screen.getByTestId('dp2p-mobile-full-page-modal_container')).toBeInTheDocument();
    });

    it('Order confirmation must be cancelled when click on Cancel button', () => {
        isMobile.mockReturnValue(true)
        render(<BuySellModal {...props} />);

        fireEvent.click(screen.getByText('Cancel'));

        expect(setShouldShowPopup).toHaveBeenCalledWith(false);
    });

    it('Order confirmation must be confirmed when click on Confirm button', () => {
        isMobile.mockReturnValue(true)
        render(<BuySellModal {...props} />);

        fireEvent.click(screen.getByText('Confirm'));

        // expect(setOrderId).toHaveBeenCalledWith();
        // expect(redirectTo).toHaveBeenCalledWith();
        // expect(setShouldShowPopup).toHaveBeenCalledWith(false);
    });
});
