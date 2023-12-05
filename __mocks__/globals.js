// Mock copy-anything module which is causing issues with jest in coveralls
jest.mock('copy-anything', () => ({
    copy: jest.fn(),
}));

jest.mock('@deriv/analytics', () => ({
    Analytics: {
        trackEvent: jest.fn(),
        pageView: jest.fn(),
        reset: jest.fn(),
        setAttributes: jest.fn(),
    },
}));

const mock_onfido = {
    init: jest.fn().mockResolvedValue({}),
};

window.Onfido = mock_onfido;
