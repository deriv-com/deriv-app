import {
    mockAccountSecurity,
    mockAuthorize,
    mockBalanceAll,
    // mockBalanceOne,
    mockGetAccountStatus,
    mockGetFinancialAssessment,
    mockGetLimits,
    mockGetSelfExclusion,
    mockGetSettings,
    mockLandingCompany,
    mockMt5LoginList,
    mockP2pAdvertiserInfo,
    mockP2pOrderList,
    mockPaymentagentList,
    mockPlatformDxtrade,
    mockPlatformMt5,
    mockPortfolio,
    mockStatement,
    mockTradingPlatformAccounts,
    mockTradingPlatformAvailableAccounts,
    mockTransaction,
} from '@deriv/integration';

import { mockWalletsBalances } from './mockWalletsBalances';

const walletsLoggedIn = async (context: any) => {
    mockAccountSecurity(context);
    mockAuthorize(context);
    mockWalletsBalances(context);
    // mockBalanceOne(context);
    mockGetAccountStatus(context);
    mockGetFinancialAssessment(context);
    mockGetLimits(context);
    mockGetSelfExclusion(context);
    mockGetSettings(context);
    mockLandingCompany(context);
    mockMt5LoginList(context);
    mockP2pAdvertiserInfo(context);
    mockP2pOrderList(context);
    mockPaymentagentList(context);
    mockPlatformDxtrade(context);
    mockPlatformMt5(context);
    mockPortfolio(context);
    mockStatement(context);
    mockTradingPlatformAccounts(context);
    mockTradingPlatformAvailableAccounts(context);
    mockTransaction(context);
};

export default walletsLoggedIn;
