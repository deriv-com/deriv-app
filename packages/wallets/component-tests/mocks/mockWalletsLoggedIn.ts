import {
    mockAccountSecurity,
    mockAuthorize,
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
import { Context } from '@deriv/integration/src/utils/mocks/mocks';
import { mockWalletsBalances } from './mockWalletsBalances';

const walletsLoggedIn = async (context: Context) => {
    mockAccountSecurity(context);
    mockAuthorize(context);
    mockWalletsBalances(context);
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
