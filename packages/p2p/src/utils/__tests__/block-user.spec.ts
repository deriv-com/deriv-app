import { getErrorMessage, getErrorModalTitle } from 'Utils/block-user';

jest.mock('@deriv/shared', () => ({
    isMobile: jest.fn(() => false),
}));

describe('getErrorMessage', () => {
    it('should return default message if is_invalid_advertiser_id is false', () => {
        expect(getErrorMessage('default message', false, false, 'name')).toEqual('default message');
    });

    it('should return error message if is_invalid_advertiser_id is true', () => {
        expect(getErrorMessage('default message', true, true, 'name')).toEqual(
            "Unblocking wasn't possible as name is not using Deriv P2P anymore."
        );
    });
});

describe('getErrorModalTitle', () => {
    it('should return default title if is_invalid_advertiser_id is false', () => {
        expect(getErrorModalTitle(false, 'name')).toEqual('Unable to block advertiser');
    });

    it('should return error title if is_invalid_advertiser_id is true', () => {
        expect(getErrorModalTitle(true, 'name')).toEqual('name is no longer on Deriv P2P');
    });
});
