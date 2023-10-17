import { renderHook } from '@testing-library/react-hooks';
import useMT5SVGEligibleToMigrate from '../useMT5SVGEligibleToMigrate';
import { useMT5AccountsList } from '@deriv/api';

const mock_landing_company_short_code = 'svg';
jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useMT5AccountsList: jest.fn(),
}));

const mockUseMT5AccountsList = useMT5AccountsList as jest.MockedFunction<typeof useMT5AccountsList>;

describe('useMT5SVGEligibleToMigrate', () => {
    it('should return all values of svg to bvi financial accounts in the hook', () => {
        mockUseMT5AccountsList.mockReturnValue({
            data: [
                // @ts-expect-error not all data will be pass to useMT5AccountList
                {
                    landing_company_short: mock_landing_company_short_code,
                    eligible_to_migrate: { financial: 'bvi' },
                },
            ],
        });

        const {
            no_of_svg_accounts_to_migrate,
            has_svg_accounts_to_migrate,
            eligible_account_to_migrate_label,
            eligible_svg_to_bvi_financial_accounts,
        } = renderHook(() => useMT5SVGEligibleToMigrate()).result.current;

        expect(no_of_svg_accounts_to_migrate).toBe(1);
        expect(eligible_account_to_migrate_label).toBe('BVI');
        expect(has_svg_accounts_to_migrate).toBeTruthy();
        expect(eligible_svg_to_bvi_financial_accounts).toBeTruthy();
    });

    it('should return all values of svg to bvi derived accounts in the hook', () => {
        mockUseMT5AccountsList.mockReturnValue({
            data: [
                {
                    landing_company_short: mock_landing_company_short_code,
                    eligible_to_migrate: { synthetic: 'bvi' },
                },
            ],
        });

        const { eligible_account_to_migrate_label, eligible_svg_to_bvi_derived_accounts } = renderHook(() =>
            useMT5SVGEligibleToMigrate()
        ).result.current;

        expect(eligible_account_to_migrate_label).toBe('BVI');
        expect(eligible_svg_to_bvi_derived_accounts).toBeTruthy();
    });

    it('should return all values of svg to vanuatu financial accounts in the hook', () => {
        mockUseMT5AccountsList.mockReturnValue({
            data: [
                // @ts-expect-error not all data will be pass to useMT5AccountList
                {
                    landing_company_short: mock_landing_company_short_code,
                    eligible_to_migrate: { financial: 'vanuatu' },
                },
            ],
        });

        const { eligible_account_to_migrate_label, eligible_svg_to_vanuatu_financial_accounts } = renderHook(() =>
            useMT5SVGEligibleToMigrate()
        ).result.current;

        expect(eligible_account_to_migrate_label).toBe('Vanuatu');
        expect(eligible_svg_to_vanuatu_financial_accounts).toBeTruthy();
    });

    it('should return all values of svg to vanuatu derived accounts in the hook', () => {
        mockUseMT5AccountsList.mockReturnValue({
            data: [
                {
                    landing_company_short: mock_landing_company_short_code,
                    eligible_to_migrate: { synthetic: 'vanuatu' },
                },
            ],
        });

        const { eligible_account_to_migrate_label, eligible_svg_to_vanuatu_derived_accounts } = renderHook(() =>
            useMT5SVGEligibleToMigrate()
        ).result.current;

        expect(eligible_account_to_migrate_label).toBe('Vanuatu');
        expect(eligible_svg_to_vanuatu_derived_accounts).toBeTruthy();
    });

    it('should return all values of both svg to vanuatu derived accounts and svg to vanuatu financial accounts in the hook', () => {
        mockUseMT5AccountsList.mockReturnValue({
            data: [
                {
                    landing_company_short: mock_landing_company_short_code,
                    eligible_to_migrate: { synthetic: 'vanuatu' },
                },
                // @ts-expect-error not all data will be pass to useMT5AccountList
                {
                    landing_company_short: mock_landing_company_short_code,
                    eligible_to_migrate: { financial: 'vanuatu' },
                },
            ],
        });

        const {
            no_of_svg_accounts_to_migrate,
            eligible_svg_to_bvi_derived_accounts,
            eligible_svg_to_bvi_financial_accounts,
            eligible_svg_to_vanuatu_derived_accounts,
            eligible_svg_to_vanuatu_financial_accounts,
        } = renderHook(() => useMT5SVGEligibleToMigrate()).result.current;

        expect(no_of_svg_accounts_to_migrate).toBe(2);
        expect(eligible_svg_to_bvi_derived_accounts).not.toBeTruthy();
        expect(eligible_svg_to_bvi_financial_accounts).not.toBeTruthy();
        expect(eligible_svg_to_vanuatu_derived_accounts).toBeTruthy();
        expect(eligible_svg_to_vanuatu_financial_accounts).toBeTruthy();
    });

    it('should return all values of both svg to vanuatu derived accounts and svg to vanuatu financial accounts in the hook', () => {
        mockUseMT5AccountsList.mockReturnValue({
            data: [
                {
                    landing_company_short: mock_landing_company_short_code,
                    eligible_to_migrate: { synthetic: 'bvi' },
                },
                // @ts-expect-error not all data will be pass to useMT5AccountList
                {
                    landing_company_short: mock_landing_company_short_code,
                    eligible_to_migrate: { financial: 'bvi' },
                },
            ],
        });

        const {
            no_of_svg_accounts_to_migrate,
            eligible_svg_to_bvi_derived_accounts,
            eligible_svg_to_bvi_financial_accounts,
            eligible_svg_to_vanuatu_derived_accounts,
            eligible_svg_to_vanuatu_financial_accounts,
        } = renderHook(() => useMT5SVGEligibleToMigrate()).result.current;

        expect(no_of_svg_accounts_to_migrate).toBe(2);
        expect(eligible_svg_to_bvi_derived_accounts).toBeTruthy();
        expect(eligible_svg_to_bvi_financial_accounts).toBeTruthy();
        expect(eligible_svg_to_vanuatu_derived_accounts).not.toBeTruthy();
        expect(eligible_svg_to_vanuatu_financial_accounts).not.toBeTruthy();
    });
});
