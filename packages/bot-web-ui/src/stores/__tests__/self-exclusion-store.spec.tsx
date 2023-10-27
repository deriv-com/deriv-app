import SelfExclusionStore from '../self-exclusion-store';

type TMockCore = {
    client: {
        is_eu: boolean;
        is_virtual: boolean;
        getSelfExclusion: () => void;
        self_exclusion: {
            max_losses?: number;
        };
    };
};

describe('SelfExclusionStore', () => {
    let mockCore: TMockCore;

    beforeEach(() => {
        mockCore = {
            client: {
                is_eu: false,
                is_virtual: false,
                getSelfExclusion: jest.fn(),
                self_exclusion: {},
            },
        };
    });

    it('should initialize with default values', () => {
        const store = new SelfExclusionStore(null, mockCore);

        expect(store.api_max_losses).toBe(0);
        expect(store.run_limit).toBe(-1);
        expect(store.is_restricted).toBe(false);
    });

    it('should return initial values', () => {
        const store = new SelfExclusionStore(null, mockCore);

        expect(store.initial_values).toEqual({
            form_max_losses: '',
            run_limit: '',
        });
    });

    it('should allow bot to run by default', () => {
        const store = new SelfExclusionStore(null, mockCore);

        expect(store.should_bot_run).toBe(true);
    });

    it('should not allow bot to run under certain conditions', () => {
        mockCore.client.is_eu = true;
        const store = new SelfExclusionStore(null, mockCore);

        expect(store.should_bot_run).toBe(false);
    });

    it('should set is_restricted', () => {
        const store = new SelfExclusionStore(null, mockCore);
        store.setIsRestricted(true);

        expect(store.is_restricted).toBe(true);
    });

    it('should set api_max_losses', () => {
        const store = new SelfExclusionStore(null, mockCore);
        store.setApiMaxLosses(100);

        expect(store.api_max_losses).toBe(100);
    });

    it('should set run_limit', () => {
        const store = new SelfExclusionStore(null, mockCore);
        store.setRunLimit(50);

        expect(store.run_limit).toBe(50);
    });

    it('should reset self exclusion values', () => {
        const store = new SelfExclusionStore(null, mockCore);
        store.resetSelfExclusion();

        expect(store.is_restricted).toBe(false);
        expect(store.api_max_losses).toBe(0);
        expect(store.run_limit).toBe(-1);
    });

    it('should update api_max_losses after checking restriction', async () => {
        mockCore.client.self_exclusion.max_losses = 150;
        const store = new SelfExclusionStore(null, mockCore);
        await store.checkRestriction();

        expect(store.api_max_losses).toBe(150);
    });
});
