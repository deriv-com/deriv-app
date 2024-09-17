import { OSDetectionUtils } from '@deriv-com/utils';
import { DESKTOP_PLATFORMS, MOBILE_PLATFORMS } from '../../../../constants';
import {
    getDeeplinkUrl,
    getMobileAppInstallerURL,
    getMobileAppInstallerUrl,
    getMobileDownloadOptions,
    getPlatformMt5DownloadLink,
    getWebtraderUrl,
} from '../constants';

jest.mock('@deriv-com/utils', () => ({
    OSDetectionUtils: {
        mobileOSDetectAsync: jest.fn(),
    },
}));

jest.mock('../urlConfig', () => ({
    whiteLabelLinks: {
        huawei: 'huawei-link',
        linux: 'linux-link',
        macos: 'macos-link',
    },
}));

describe('MT5 Trade Link Constants', () => {
    const mockMT5TradeAccount = {
        display_login: 'display_login',
        server_info: {
            environment: 'environment',
        },
        white_label_links: {
            android: 'android-link',
            ios: 'ios-link',
            webtrader_url: 'webtrader-url',
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getPlatformMt5DownloadLink', () => {
        it('returns correct link for Linux', () => {
            expect(getPlatformMt5DownloadLink(DESKTOP_PLATFORMS.LINUX)).toBe('linux-link');
        });

        it('returns correct link for macOS', () => {
            expect(getPlatformMt5DownloadLink(DESKTOP_PLATFORMS.MACOS)).toBe('macos-link');
        });

        it('returns correct link for Huawei', () => {
            expect(getPlatformMt5DownloadLink(MOBILE_PLATFORMS.HAUWEI)).toBe('huawei-link');
        });

        it('returns empty string for unknown platform', () => {
            expect(getPlatformMt5DownloadLink('unknown')).toBe('');
        });
    });

    describe('getMobileAppInstallerURL', () => {
        it('returns iOS link for iOS', async () => {
            (OSDetectionUtils.mobileOSDetectAsync as jest.Mock).mockResolvedValue('iOS');
            // @ts-expect-error - since this is a mock, we only need partial properties of the account
            const result = await getMobileAppInstallerURL({ mt5TradeAccount: mockMT5TradeAccount });
            expect(result).toBe('ios-link');
        });

        it('returns Huawei link for Huawei', async () => {
            (OSDetectionUtils.mobileOSDetectAsync as jest.Mock).mockResolvedValue('huawei');
            // @ts-expect-error - since this is a mock, we only need partial properties of the account
            const result = await getMobileAppInstallerURL({ mt5TradeAccount: mockMT5TradeAccount });
            expect(result).toBe('huawei-link');
        });

        it('returns Android link for other OS', async () => {
            (OSDetectionUtils.mobileOSDetectAsync as jest.Mock).mockResolvedValue('Android');
            // @ts-expect-error - since this is a mock, we only need partial properties of the account
            const result = await getMobileAppInstallerURL({ mt5TradeAccount: mockMT5TradeAccount });
            expect(result).toBe('android-link');
        });
    });

    describe('getMobileDownloadOptions', () => {
        it('returns correct download options', () => {
            // @ts-expect-error - since this is a mock, we only need partial properties of the account
            const options = getMobileDownloadOptions({ mt5TradeAccount: mockMT5TradeAccount });
            expect(options).toEqual([
                { href: 'ios-link', icon: 'IcInstallationApple' },
                { href: 'android-link', icon: 'IcInstallationGoogle' },
                { href: 'huawei-link', icon: 'IcInstallationHuawei' },
            ]);
        });
    });

    describe('getWebtraderUrl', () => {
        it('returns correct webtrader URL', () => {
            // @ts-expect-error - since this is a mock, we only need partial properties of the account
            const url = getWebtraderUrl({ mt5TradeAccount: mockMT5TradeAccount });
            expect(url).toBe('webtrader-url?login=display_login&server=environment');
        });
    });

    describe('getDeeplinkUrl', () => {
        it('returns correct deeplink URL', () => {
            // @ts-expect-error - since this is a mock, we only need partial properties of the account
            const url = getDeeplinkUrl({ mt5TradeAccount: mockMT5TradeAccount });
            expect(url).toBe('metatrader5://account?login=display_login&server=environment');
        });
    });

    describe('getMobileAppInstallerUrl', () => {
        it('returns iOS link for iOS', async () => {
            (OSDetectionUtils.mobileOSDetectAsync as jest.Mock).mockResolvedValue('iOS');
            // @ts-expect-error - since this is a mock, we only need partial properties of the account
            const result = await getMobileAppInstallerUrl({ mt5TradeAccount: mockMT5TradeAccount });
            expect(result).toBe('ios-link');
        });

        it('returns Huawei link for Huawei', async () => {
            (OSDetectionUtils.mobileOSDetectAsync as jest.Mock).mockResolvedValue('huawei');
            // @ts-expect-error - since this is a mock, we only need partial properties of the account
            const result = await getMobileAppInstallerUrl({ mt5TradeAccount: mockMT5TradeAccount });
            expect(result).toBe('huawei-link');
        });

        it('returns Android link for other OS', async () => {
            (OSDetectionUtils.mobileOSDetectAsync as jest.Mock).mockResolvedValue('Android');
            // @ts-expect-error - since this is a mock, we only need partial properties of the account
            const result = await getMobileAppInstallerUrl({ mt5TradeAccount: mockMT5TradeAccount });
            expect(result).toBe('android-link');
        });
    });
});
