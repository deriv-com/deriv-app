import { test, expect } from '@playwright/test';
import { mock_residents_list, mock_states_list, mock_general, mock_loggedIn, setupMocks } from '@deriv/integration';
import {Context} from "@deriv/integration/src/utils/mocks/mocks";

const mock_account_list = () => [
    {
        "account_category": "trading",
        "account_type": "standard",
        "created_at": 1699327783,
        "currency": "BTC",
        "is_disabled": 0,
        "is_virtual": 0,
        "landing_company_name": "svg",
        "linked_to": [
            {
                "loginid": "CRW1004",
                "platform": "dwallet"
            }
        ],
        "loginid": "CR90000244"
    },
    {
        "account_category": "wallet",
        "account_type": "crypto",
        "created_at": 1699327783,
        "currency": "BTC",
        "is_disabled": 0,
        "is_virtual": 0,
        "landing_company_name": "svg",
        "linked_to": [
            {
                "loginid": "CR90000244",
                "platform": "dtrade"
            }
        ],
        "loginid": "CRW1004"
    },
    {
        "account_category": "trading",
        "account_type": "binary",
        "created_at": 1699327783,
        "currency": "USD",
        "is_disabled": 0,
        "is_virtual": 1,
        "landing_company_name": "virtual",
        "linked_to": [
            {
                "loginid": "VRW1005",
                "platform": "dwallet"
            }
        ],
        "loginid": "VRTC90000116"
    },
    {
        "account_category": "wallet",
        "account_type": "virtual",
        "created_at": 1699327783,
        "currency": "USD",
        "is_disabled": 0,
        "is_virtual": 1,
        "landing_company_name": "virtual",
        "linked_to": [
            {
                "loginid": "VRTC90000116",
                "platform": "dtrade"
            }
        ],
        "loginid": "VRW1005"
    }
];

export default function mock_wallets_authorise(context: Context) {
    if ('authorise' in context.request) {
        // @ts-ignore
        context.response.account_list = account_list;
    }
}

test.describe('Alpha', () => {
    test('header renders', async ({ page, baseURL }) => {
        await setupMocks({
            baseURL,
            page,
            mocks: [mock_general, mock_loggedIn, mock_account_list],
        });
        await page.goto(`${baseURL}/wallets`);

        return new Promise((resolve) => {
           setTimeout(() => {
               resolve();
           }, 50000);
        });
        // const personalDetailsLink = await page.getByRole('link', { name: 'Personal details' });
        // const languagesLink = await page.getByRole('link', { name: 'Languages' });
        //
        // expect(await personalDetailsLink.getAttribute('aria-current')).toBe('page');
        // expect(await languagesLink.getAttribute('aria-current')).not.toBe('page');
        //
        // await languagesLink.click();
        //
        // expect(await personalDetailsLink.getAttribute('aria-current')).not.toBe('page');
        // expect(await languagesLink.getAttribute('aria-current')).toBe('page');
    });
});
