// Mock copy-anything module which is causing issues with jest in coveralls
jest.mock('copy-anything', () => ({
    copy: jest.fn(),
}));

const mock_onfido = {
    init: jest.fn().mockResolvedValue({}),
};

window.Onfido = mock_onfido;
