import { useStore } from '@deriv/stores';
import { useMT5AccountsList, useDxtradeAccountsList, useCtraderAccountsList } from '@deriv/api';
import { getAccountListKey, CFD_PLATFORMS, Jurisdiction } from '@deriv/shared';

type MT5AccountsList = NonNullable<ReturnType<typeof useMT5AccountsList>['data']>[number];
type DxtradeAccountsList = NonNullable<ReturnType<typeof useDxtradeAccountsList>['data']>[number];
type CtraderAccountsList = NonNullable<ReturnType<typeof useCtraderAccountsList>['data']>[number];

type TCurrentList = {
    [key: string]: MT5AccountsList | DxtradeAccountsList | CtraderAccountsList;
};

/* 
    This hook is used to get the existing_accounts_data
*/
const useCurrentList = () => {
    const current_list: TCurrentList = {};
    const { traders_hub } = useStore();
    const { data: mt5_accounts } = useMT5AccountsList();
    const { data: dxtrade_accounts } = useDxtradeAccountsList();
    const { data: ctrader_accounts } = useCtraderAccountsList();
    const show_eu_related_content = traders_hub.show_eu_related_content;

    mt5_accounts
        ?.filter(acc =>
            show_eu_related_content
                ? acc.landing_company_short === Jurisdiction.MALTA_INVEST
                : acc.landing_company_short !== Jurisdiction.MALTA_INVEST
        )
        .forEach(account => {
            current_list[getAccountListKey(account, CFD_PLATFORMS.MT5, account.landing_company_short)] = {
                ...account,
            };
        });

    dxtrade_accounts?.forEach(account => {
        current_list[getAccountListKey(account, CFD_PLATFORMS.DXTRADE, account.landing_company_short)] = {
            ...account,
        };
    });

    ctrader_accounts?.forEach(account => {
        current_list[getAccountListKey(account, CFD_PLATFORMS.CTRADER, account.landing_company_short)] = {
            ...account,
        };
    });

    return { current_list };
};

export default useCurrentList;
