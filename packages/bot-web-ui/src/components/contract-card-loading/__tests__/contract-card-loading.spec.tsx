// import React from 'react';
// import { isDesktop, isMobile } from '@deriv/shared';
// import { mockStore, StoreProvider } from '@deriv/stores';
// // eslint-disable-next-line import/no-extraneous-dependencies
// import { act, render, screen } from '@testing-library/react';
// import { mock_ws } from 'Utils/mock';
// import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';

// jest.mock('@deriv/shared', () => ({
//     ...jest.requireActual('@deriv/shared'),
//     isMobile: jest.fn(),
//     isDesktop: jest.fn(),
// }));

// jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
// jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
//     saveRecentWorkspace: jest.fn(),
//     unHighlightAllBlocks: jest.fn(),
// }));
// jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

// describe('ToolbarWidgets', () => {
//     let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;

//     const mockUpdateChartType = jest.fn();
//     const mockUpdateGranularity = jest.fn();

//     beforeAll(() => {
//         const mock_store = mockStore({});
//         const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

//         wrapper = ({ children }: { children: JSX.Element }) => (
//             <StoreProvider store={mock_store}>
//                 <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
//                     {children}
//                 </DBotStoreProvider>
//             </StoreProvider>
//         );
//     });

//     it('should render ToolbarWidgets in desktop', () => {
//         act(() => {
//             (isMobile as jest.Mock).mockReturnValueOnce(false);
//             (isDesktop as jest.Mock).mockReturnValueOnce(true);
//         });
//         render(<ToolbarWidgets updateChartType={mockUpdateChartType} updateGranularity={mockUpdateGranularity} />, {
//             wrapper,
//         });
//         expect(screen.getByText('Mocked StudyLegend')).toBeInTheDocument();
//     });

//     it('should render ToolbarWidgets in mobile', () => {
//         act(() => {
//             (isMobile as jest.Mock).mockReturnValueOnce(true);
//             (isDesktop as jest.Mock).mockReturnValueOnce(false);
//         });
//         render(<ToolbarWidgets updateChartType={mockUpdateChartType} updateGranularity={mockUpdateGranularity} />, {
//             wrapper,
//         });
//         expect(screen.queryByText('Mocked StudyLegend')).not.toBeInTheDocument();
//     });
// });
