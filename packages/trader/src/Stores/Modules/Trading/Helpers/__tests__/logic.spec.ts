import { isCancellationExpired } from '../logic';

type TMockContractInfo = {
    cancellation?: {
        date_expiry?: number;
    };
};

jest.mock('_common/base/server_time', () => ({
    get: jest.fn(() => ({
        unix: jest.fn(() => 1687046399),
    })),
}));

describe('isCancellationExpired', () => {
    const mock_contract_info: TMockContractInfo = {
        cancellation: {
            date_expiry: 1687046398,
        },
    };
    it('Should return true if server_time is bigger than date_expiry', () => {
        expect(isCancellationExpired(mock_contract_info)).toBeTruthy();
    });
    it('Should return false if server_time is smaller than date_expiry', () => {
        if (mock_contract_info.cancellation) mock_contract_info.cancellation.date_expiry = 1687046400;
        expect(isCancellationExpired(mock_contract_info)).toBeFalsy();
    });
    it('Should return false if date_expiry is undefined', () => {
        if (mock_contract_info.cancellation) mock_contract_info.cancellation.date_expiry = undefined;
        expect(isCancellationExpired(mock_contract_info)).toBeFalsy();
    });
    it('Should return false if cancelllation is an empty object', () => {
        mock_contract_info.cancellation = {};
        expect(isCancellationExpired(mock_contract_info)).toBeFalsy();
    });
});
