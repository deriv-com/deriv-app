import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import { mockContractInfo } from '@deriv/shared';
import InfoBoxLongcode from '../info-box-longcode';

const test_longcode_short = 'test longcode';
const test_longcode_long =
    'test longcode test longcode test longcode test longcode test longcode test longcode test longcode test longcode test longcode test longcode test longcode test longcode';
const test_longcode_mobile =
    'test longcode test longcode test longcode test longcode test longcode test longcode test longcode test longcode';
const view_more_text = /View more/i;
const view_less_text = /View less/i;
const mocked_props = {
    contract_info: mockContractInfo({ longcode: test_longcode_short, contract_type: 'test' }),
};
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: jest.fn(() => 'MockedIcon'),
}));

describe('InfoBoxLongcode', () => {
    const mockInfoBoxLongcode = (
        mocked_store: TCoreStores,
        mocked_props: React.ComponentProps<typeof InfoBoxLongcode>
    ) => {
        return (
            <StoreProvider store={mocked_store}>
                <InfoBoxLongcode {...mocked_props} />
            </StoreProvider>
        );
    };

    const default_mocked_store = mockStore({
        ui: {
            is_mobile: false,
        },
    });

    it('should render InfoBoxLongcode component', () => {
        render(mockInfoBoxLongcode(default_mocked_store, mocked_props));

        expect(screen.getByText('MockedIcon')).toBeInTheDocument();
        expect(screen.getByText(test_longcode_short)).toBeInTheDocument();
    });
    it('should not render specific text if longcode is less then 150 symbols', () => {
        render(mockInfoBoxLongcode(default_mocked_store, mocked_props));

        expect(screen.queryByText(view_more_text)).not.toBeInTheDocument();
    });
    it('should render specific text "View more" if longcode is more then 150 symbols', () => {
        mocked_props.contract_info.longcode = test_longcode_long;
        render(mockInfoBoxLongcode(default_mocked_store, mocked_props));

        expect(screen.getByText(view_more_text)).toBeInTheDocument();
    });
    it('should render specific text "View less" if longcode is more then 150 symbols and user click on expand button', () => {
        render(mockInfoBoxLongcode(default_mocked_store, mocked_props));
        userEvent.click(screen.getByText(view_more_text));

        expect(screen.queryByText(view_more_text)).not.toBeInTheDocument();
        expect(screen.getByText(view_less_text)).toBeInTheDocument();
    });
    it('should render specific text "View more" if longcode is more then 47 symbols for mobile', () => {
        default_mocked_store.ui.is_mobile = true;
        mocked_props.contract_info.longcode = test_longcode_mobile;
        render(mockInfoBoxLongcode(default_mocked_store, mocked_props));

        expect(screen.getByText(view_more_text)).toBeInTheDocument();
    });
    it('should render modal if longcode is more then 47 symbols for mobile and user clicks on "View more" button', () => {
        default_mocked_store.ui.is_mobile = true;
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
        mocked_props.contract_info.longcode = test_longcode_mobile;
        render(mockInfoBoxLongcode(default_mocked_store, mocked_props));
        userEvent.click(screen.getByText(view_more_text));

        expect(screen.getByText(view_more_text)).toBeInTheDocument();
        expect(screen.getByText(/Trade info/i)).toBeInTheDocument();
        expect(screen.getByText(/OK/i)).toBeInTheDocument();

        document.body.removeChild(modal_root_el);
    });
});
