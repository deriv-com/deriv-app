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
    let mockCore: TMockCore, store: SelfExclusionStore;

    beforeEach(() => {
        mockCore = {
            client: {
                is_eu: false,
                is_virtual: false,
                getSelfExclusion: jest.fn(),
                self_exclusion: {},
            },
        };
        store = new SelfExclusionStore(null, mockCore);
    });

    it('Should initialize with default values', () => {
        expect(store.api_max_losses).toBe(0);
        expect(store.run_limit).toBe(-1);
        expect(store.is_restricted).toBe(false);
    });

    it('Should return initial values', () => {
        expect(store.initial_values).toEqual({
            form_max_losses: '',
            run_limit: '',
        });
    });

    it('Should return run_limit as part of initial values when it is not -1', () => {
        store.setRunLimit(5);

        expect(store.initial_values.run_limit).toBe(5);
    });

    it('Should return empty string for run_limit in initial values when it is -1', () => {
        expect(store.initial_values.run_limit).toBe('');
    });

    it('Should allow bot to run by default', () => {
        expect(store.should_bot_run).toBe(true);
    });

    it('Should not allow bot to run under certain conditions', () => {
        mockCore.client.is_eu = true;

        expect(store.should_bot_run).toBe(false);
    });

    it('Should not allow the bot to run when client is EU, not virtual and run_limit is -1', () => {
        mockCore.client.is_eu = true;
        mockCore.client.is_virtual = false;

        store.setRunLimit(-1);

        expect(store.should_bot_run).toBe(false);
    });

    it('Should allow the bot to run when client is not EU even if run_limit is -1', () => {
        mockCore.client.is_eu = false;

        store.setRunLimit(-1);

        expect(store.should_bot_run).toBe(true);
    });

    it('Should not allow the bot to run when client is EU, not virtual and run_limit is -1 regardless of api_max_losses value', () => {
        mockCore.client.is_eu = true;
        mockCore.client.is_virtual = false;

        store.setApiMaxLosses(10); // set a value other than 0 to isolate the test from this condition
        store.setRunLimit(-1);

        expect(store.should_bot_run).toBe(false);
    });

    it('Should set is_restricted', () => {
        store.setIsRestricted(true);

        expect(store.is_restricted).toBe(true);
    });

    it('Should set api_max_losses', () => {
        store.setApiMaxLosses(100);

        expect(store.api_max_losses).toBe(100);
    });

    it('Should set run_limit', () => {
        store.setRunLimit(50);

        expect(store.run_limit).toBe(50);
    });

    it('Should reset self exclusion values', () => {
        store.resetSelfExclusion();

        expect(store.is_restricted).toBe(false);
        expect(store.api_max_losses).toBe(0);
        expect(store.run_limit).toBe(-1);
    });

    it('Should update api_max_losses after checking restriction', async () => {
        mockCore.client.self_exclusion.max_losses = 150;
        await store.checkRestriction();

        expect(store.api_max_losses).toBe(150);
    });
});
