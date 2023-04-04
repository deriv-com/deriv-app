//Need to fix errors caused by store provider implementation

import React from 'react';
import { screen, render } from '@testing-library/react';
import { formatMoney, isDesktop, isMobile, PlatformContext } from '@deriv/shared';
import AccountLimits from '../account-limits';
import { BrowserRouter } from 'react-router-dom';
import { mockStore, StoreProvider } from '@deriv/stores';

describe('App component', () => {
    let store = mockStore();
    test('renders App component without crashing', () => {
        render(
            <StoreProvider store={store}>
                <AccountLimits />
            </StoreProvider>
        );
    });
});

// jest.mock('Stores/connect.js', () => ({
//     __esModule: true,
//     default: 'mockedDefaultExport',
// }));

// jest.mock('@deriv/components', () => {
//     const original_module = jest.requireActual('@deriv/components');

//     return {
//         ...original_module,
//         Loading: jest.fn(() => 'mockedLoading'),
//     };
// });

// jest.mock('@deriv/shared', () => ({
//     ...jest.requireActual('@deriv/shared'),
//     isMobile: jest.fn(() => false),
//     isDesktop: jest.fn(() => true),
//     formatMoney: jest.fn(),
// }));

// jest.mock('Components/demo-message', () => jest.fn(() => 'mockedDemoMessage'));
// jest.mock('Components/load-error-message', () => jest.fn(() => 'mockedLoadErrorMessage'));
// jest.mock('../account-limits-footer', () => jest.fn(() => 'mockedAccountLimitsFooter'));

// describe('<AccountLimits/>', () => {
//     let store=mockStore()
//     store.client.currency="AUD"
//     store.client.is_fully_authenticated=true
//     store.client.is_switching=false
//     store.client.is_virtual=false
//     store.client.getLimits=jest.fn(() => Promise.resolve({ data: {} }))
//     store.client.account_limits={
//         account_balance: 300000,
//         daily_transfers: {
//             dxtrade: {
//                 allowed: 12,
//                 available: 12,
//             },
//             internal: {
//                 allowed: 10,
//                 available: 10,
//             },
//             mt5: {
//                 allowed: 10,
//                 available: 10,
//             },
//         },
//         lifetime_limit: 13907.43,
//         market_specific: {
//             commodities: [
//                 {
//                     name: 'Commodities',
//                     payout_limit: 5000,
//                     profile_name: 'moderate_risk',
//                     turnover_limit: 50000,
//                 },
//             ],
//             cryptocurrency: [
//                 {
//                     name: 'Cryptocurrencies',
//                     payout_limit: '100.00',
//                     profile_name: 'extreme_risk',
//                     turnover_limit: '1000.00',
//                 },
//             ],
//             forex: [
//                 {
//                     name: 'Smart FX',
//                     payout_limit: 5000,
//                     profile_name: 'moderate_risk',
//                     turnover_limit: 50000,
//                 },
//                 {
//                     name: 'Major Pairs',
//                     payout_limit: 20000,
//                     profile_name: 'medium_risk',
//                     turnover_limit: 100000,
//                 },
//                 {
//                     name: 'Minor Pairs',
//                     payout_limit: 5000,
//                     profile_name: 'moderate_risk',
//                     turnover_limit: 50000,
//                 },
//             ],
//             indices: [
//                 {
//                     name: 'Stock Indices',
//                     payout_limit: 20000,
//                     profile_name: 'medium_risk',
//                     turnover_limit: 100000,
//                 },
//             ],
//             synthetic_index: [
//                 {
//                     name: 'Synthetic Indices',
//                     payout_limit: 50000,
//                     profile_name: 'low_risk',
//                     turnover_limit: 500000,
//                 },
//             ],
//         },
//         num_of_days: 30,
//         num_of_days_limit: 13907.43,
//         open_positions: 100,
//         payout: 50000,
//         remainder: 13907.43,
//         withdrawal_for_x_days_monetary: 0,
//         withdrawal_since_inception_monetary: 0,
//     }

//     it('should render the Loading component if is_switching is true', () => {
//         store.client.is_switching=true
//         render(<StoreProvider>
//             <AccountLimits />
//         </StoreProvider>);
//         expect(screen.getByText('mockedLoading')).toBeInTheDocument();
//     });

//     it('should render DemoMessage component if is_virtual is true', () => {
//         store.client.is_virtual=true
//         const { container } = render(<StoreProvider>
//             <AccountLimits />
//         </StoreProvider>);
//         expect(container.firstChild).toHaveClass('account__demo-message-wrapper');

//         expect(screen.getByText('mockedDemoMessage')).toBeInTheDocument();
//     });

//     it('should render LoadErrorMessage component if there is api_initial_load_error', () => {
//         store.client.account_limits={ api_initial_load_error: 'error in fetching data from API' }
//         render(
//             <StoreProvider>
//             <AccountLimits />
//         </StoreProvider>
//         );
//         expect(screen.getByText('mockedLoadErrorMessage')).toBeInTheDocument();
//     });

//     it('should render AccountLimits component', () => {
//         render(<StoreProvider>
//             <AccountLimits />
//         </StoreProvider>);
//         expect(screen.queryByTestId('account_limits_data')).toBeInTheDocument();
//     });
//     it('should call setIsPopupOverlayShown fn ', () => {
//         const setIsPopupOverlayShown = jest.fn();
//         render(<StoreProvider>
//             <AccountLimits setIsOverlayShown={setIsPopupOverlayShown} />
//         </StoreProvider>
//        );
//         expect(setIsPopupOverlayShown).toHaveBeenCalledTimes(1);
//     });

//     it('should render Loading component if is_loading is true', () => {
//         render(<StoreProvider>
//             <AccountLimits />
//         </StoreProvider>);
//         expect(screen.queryByTestId('account_limits_data')).toBeInTheDocument();
//     });

//     it('should render AccountLimitsArticle component if should_show_article is true  and is_from_derivgo is false  in mobile mode', () => {
//         isMobile.mockReturnValue(true);
//         isDesktop.mockReturnValue(false);
//         render(<AccountLimits {...props} should_show_article />);
//         expect(screen.getByRole('heading', { name: /account limits/i })).toBeInTheDocument();
//         expect(
//             screen.queryByText(/to learn more about trading limits and how they apply, please go to the/i)
//         ).toBeInTheDocument();
//     });

//     it('should render AccountLimitsArticle component if should_show_article is true and is_from_derivgo is true in mobile mode', () => {
//         isMobile.mockReturnValue(true);
//         isDesktop.mockReturnValue(false);
//         store.common.is_from_derivgo=true
//         render(<StoreProvider>
//             <AccountLimits should_show_article={false} />
//         </StoreProvider>);
//         expect(screen.getByRole('heading', { name: /account limits/i })).toBeInTheDocument();
//         expect(
//             screen.queryByText(/to learn more about trading limits and how they apply, please go to the/i)
//         ).not.toBeInTheDocument();
//     });

//     it('should not render AccountLimitsArticle component if should_show_article is false', () => {
//         isMobile.mockReturnValue(true);
//         isDesktop.mockReturnValue(false);
//         render(<StoreProvider>
//             <AccountLimits should_show_article={false} />
//         </StoreProvider>
//         );
//         expect(screen.queryByText('/account limits/i')).not.toBeInTheDocument();
//     });

//     it('should render Trading limits table and its trading limits contents properly', () => {
//         render(<StoreProvider>
//             <AccountLimits  />
//         </StoreProvider>);
//         expect(screen.queryByTestId('account_limits_data')).toBeInTheDocument();

//         expect(
//             screen.getByRole('columnheader', {
//                 name: /trading limits/i,
//             })
//         ).toBeInTheDocument();
//         expect(
//             screen.getByRole('cell', {
//                 name: /\*maximum number of open positions/i,
//             })
//         ).toBeInTheDocument();
//         expect(
//             screen.getByRole('cell', {
//                 name: /\*maximum account cash balance/i,
//             })
//         ).toBeInTheDocument();
//     });

//     it('should render Maximum number of open positions- table cell and its contents properly', () => {
//         render(<StoreProvider>
//             <AccountLimits  />
//         </StoreProvider>);
//         expect(
//             screen.getByRole('cell', {
//                 name: /\*maximum number of open positions/i,
//             })
//         ).toBeInTheDocument();
//         const { open_positions } = props.account_limits;
//         expect(
//             screen.getByRole('cell', {
//                 name: open_positions,
//             })
//         ).toBeInTheDocument();
//     });

//     it('should call formatMoney', () => {
//         render(<StoreProvider>
//             <AccountLimits  />
//         </StoreProvider>);
//         const { account_balance } = props.account_limits;
//         expect(formatMoney).toHaveBeenCalledWith(props.currency, account_balance, true);
//     });

//     it('should render Trading limits table and its maximum daily turnover contents properly', () => {
//         render(<StoreProvider>
//             <AccountLimits  />
//         </StoreProvider>);
//         expect(screen.queryByTestId('trading_daily_turnover_table')).toBeInTheDocument();
//         expect(
//             screen.getByRole('columnheader', {
//                 name: /maximum daily turnover/i,
//             })
//         ).toBeInTheDocument();
//         expect(
//             screen.getByRole('cell', {
//                 name: /commodities/i,
//             })
//         ).toBeInTheDocument();
//         expect(
//             screen.getByRole('cell', {
//                 name: /stock indices/i,
//             })
//         ).toBeInTheDocument();
//     });

//     it('should not render withdrawal_limits_table is_app_settings is true', () => {
//         render(<StoreProvider>
//             <AccountLimits is_app_settings={true} />
//         </StoreProvider>);
//         expect(screen.queryByTestId('withdrawal_limits_table')).not.toBeInTheDocument();
//     });

//     it('should render withdrawal_limits_table is_app_settings is false', () => {
//         render(<AccountLimits {...props} />);
//         expect(screen.queryByTestId('withdrawal_limits_table')).toBeInTheDocument();
//         expect(
//             screen.getByRole('columnheader', {
//                 name: /withdrawal limits/i,
//             })
//         ).toBeInTheDocument();
//     });

//     it('withdrawal_limits_table should have a Limits header if is_fully_authenticated is true', () => {
//         render(<StoreProvider>
//             <AccountLimits  />
//         </StoreProvider>);
//         expect(screen.getByTestId('withdrawal_limits_table')).toHaveTextContent('Limit');
//     });

//     it('show show withdrawal limit lifted message if is_fully_authenticated is true', () => {
//         render(<StoreProvider>
//             <AccountLimits  />
//         </StoreProvider>);

//         expect(
//             screen.getByRole('cell', {
//                 name: /your account is fully authenticated and your withdrawal limits have been lifted\./i,
//             })
//         ).toBeInTheDocument();
//     });

//     it('withdrawal_limits_table should show `Total withdrawal limit` if is_fully_authenticated is false and is_appstore is true', () => {
//         store.client.is_fully_authenticated=true
//         render(
//             <PlatformContext.Provider value={{ is_appstore: true }}>
//                 <BrowserRouter>
//                 <StoreProvider>
//             <AccountLimits  />
//         </StoreProvider>
//                 </BrowserRouter>
//             </PlatformContext.Provider>
//         );
//         expect(screen.getByText(/total withdrawal limit/i)).toBeInTheDocument();
//     });

//     it('withdrawal_limits_table should show `Total withdrawal allowed` when is_fully_authenticated is false and is_appstore is true', () => {
//         store.client.is_fully_authenticated=false
//         render(
//             <PlatformContext.Provider value={{ is_appstore: false }}>
//                 <StoreProvider>
//             <AccountLimits  />
//         </StoreProvider>
//             </PlatformContext.Provider>
//         );
//         expect(screen.getByText(/total withdrawal allowed/i)).toBeInTheDocument();
//     });

//     it('withdrawal_limits_table should show the verfiy button when is_fully_authenticated is false and is_appstore is true', () => {
//         store.client.is_fully_authenticated=false
//         render(
//             <PlatformContext.Provider value={{ is_appstore: true }}>
//                 <BrowserRouter>
//                 <StoreProvider>
//             <AccountLimits  />
//         </StoreProvider>
//                 </BrowserRouter>
//             </PlatformContext.Provider>
//         );
//         expect(screen.getByText(/to increase limit please verify your identity/i)).toBeInTheDocument();

//         expect(
//             screen
//                 .getByRole('link', {
//                     name: /verify/i,
//                 })
//                 .closest('a')
//         ).toHaveAttribute('href', '/account/proof-of-identity');
//         const { num_of_days_limit } = store.client.account_limits;
//         expect(formatMoney).toHaveBeenCalledWith(store.client.currency, num_of_days_limit, true);
//     });

//     it('withdrawal_limits_table should show total withdrawn and withdrawn remaining details', () => {
//         store.client.is_fully_authenticated=false
//         render(
//             <PlatformContext.Provider value={{ is_appstore: true }}>
//                 <BrowserRouter>
//                 <StoreProvider>
//             <AccountLimits  />
//         </StoreProvider>
//                 </BrowserRouter>
//             </PlatformContext.Provider>
//         );
//         const { withdrawal_since_inception_monetary, remainder } = props.account_limits;

//         expect(screen.getByText(/total withdrawn/i)).toBeInTheDocument();
//         expect(formatMoney).toHaveBeenCalledWith(props.currency, withdrawal_since_inception_monetary, true);

//         expect(screen.getByText(/maximum withdrawal remaining/i)).toBeInTheDocument();
//         expect(formatMoney).toHaveBeenCalledWith(props.currency, remainder, true);
//     });

//     it('should show limit_notice message when is_appstore is true and is_fully_authenticated is false in mobile mode', () => {
//         isDesktop.mockReturnValue(false);
//         isMobile.mockReturnValue(true);
//         store.client.is_fully_authenticated=false
//         render(
//             <PlatformContext.Provider value={{ is_appstore: true }}>
//                 <BrowserRouter>
//                 <StoreProvider>
//             <AccountLimits  />
//         </StoreProvider>
//                 </BrowserRouter>
//             </PlatformContext.Provider>
//         );
//         expect(screen.getByText(/stated limits are subject to change without prior notice\./i)).toBeInTheDocument();
//     });

//     it('should not  show limit_notice message when is_appstore is false and is_fully_authenticated is false', () => {
//         isDesktop.mockReturnValue(true);
//         isMobile.mockReturnValue(false);
//         store.client.is_fully_authenticated=false
//         render(
//             <PlatformContext.Provider value={{ is_appstore: false }}>
//                 <BrowserRouter>
//                 <StoreProvider>
//             <AccountLimits is_app_settings={false} />
//         </StoreProvider>
//                 </BrowserRouter>
//             </PlatformContext.Provider>
//         );
//         expect(
//             screen.queryByText(/your account is fully authenticated and your withdrawal limits have been lifted\./i)
//         ).not.toBeInTheDocument();
//     });

//     it('should show AccountLimitsArticle when should_show_article and isDesktop is true', () => {
//         isDesktop.mockReturnValue(true);
//         isMobile.mockReturnValue(false);
//         render(<StoreProvider>
//             <AccountLimits should_show_article={true} />
//         </StoreProvider>);
//         expect(screen.getByRole('heading', { name: /account limits/i })).toBeInTheDocument();
//         expect(screen.getByText(/these are default limits that we apply to your accounts\./i)).toBeInTheDocument();
//         expect(
//             screen.getByText(/to learn more about trading limits and how they apply, please go to the/i)
//         ).toBeInTheDocument();
//         expect(
//             screen
//                 .getByRole('link', {
//                     name: /help centre/i,
//                 })
//                 .closest('a')
//         ).toHaveAttribute('href', 'https://deriv.com/help-centre/trading/#trading-limits');
//     });

//     it('should show AccountLimitsFooter if footer_ref is passed', () => {
//         const footer = { current: { offsetWidth: 100 } };
//         render(<StoreProvider>
//             <AccountLimits should_show_article={true} footer_ref={footer} />
//         </StoreProvider>);
//         expect(screen.getByText(/mockedaccountlimitsfooter/i)).toBeInTheDocument();
//     });
// });
