import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import TourSteps from '../tour-steps';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/services/tradeEngine/utils/helpers', () => ({
    getUUID: jest.fn(() => 'unique-id'),
}));

describe('Tour Steps', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    const mock_store = mockStore({});
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

    beforeEach(() => {
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('render TourSteps component', () => {
        render(<TourSteps content={[]} label={'Import or choose your bot'} step_index={1} />, { wrapper });
        expect(screen.getByText('Import or choose your bot')).toBeInTheDocument();
    });

    it('render TourSteps with media files', () => {
        render(<TourSteps content={[]} label='Import bot media' step_index={1} media='media.mp4' />);
        const video_element = screen.getByText('Import bot media');
        expect(video_element).toBeInTheDocument();
    });

    it('render with content if has_localize_component is true', () => {
        const localize_component = <p key='localize-key'>Localized content</p>;
        render(<TourSteps content={[localize_component]} label='Localized' step_index={1} has_localize_component />);
        expect(screen.getByText('Localized content')).toBeInTheDocument();
    });
});
