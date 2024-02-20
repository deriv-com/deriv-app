import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../trader-providers';
import ContractTypeDescriptionVideo from '../contract-type-description-video';
import { TCoreStores } from '@deriv/stores/types';
import { TRADE_TYPES } from '@deriv/shared';

const default_mocked_props = {
    selected_contract_type: TRADE_TYPES.VANILLA.CALL,
    data_testid: 'dt_description_video',
};

describe('<ContractTypeDescriptionVideo />', () => {
    const mockContractTypeDescriptionVideo = (
        mocked_store: TCoreStores,
        mocked_props: React.ComponentProps<typeof ContractTypeDescriptionVideo>
    ) => {
        return (
            <TraderProviders store={mocked_store}>
                <ContractTypeDescriptionVideo {...mocked_props} />
            </TraderProviders>
        );
    };
    it('should render the component with video if selected_contract_type does support video', () => {
        render(mockContractTypeDescriptionVideo(mockStore({}), default_mocked_props));

        expect(screen.getByTestId(/description_video/i)).toBeInTheDocument();
    });

    it('should be able to find a proper video and render the component if is_dark_mode_on is true', () => {
        const mock_root_store = mockStore({ ui: { is_dark_mode_on: true } });
        render(mockContractTypeDescriptionVideo(mock_root_store, default_mocked_props));

        expect(screen.getByTestId(/description_video/i)).toBeInTheDocument();
    });

    it('should return null if selected_contract_type is falsy', () => {
        const new_mocked_props = { ...default_mocked_props, selected_contract_type: '' };
        const { container } = render(mockContractTypeDescriptionVideo(mockStore({}), new_mocked_props));

        expect(container).toBeEmptyDOMElement();
    });
});
