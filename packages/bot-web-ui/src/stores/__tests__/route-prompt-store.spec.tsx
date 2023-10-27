import RoutePromptDialogStore from '../route-prompt-dialog-store';

const mockRouteTo = jest.fn();

const mockCommonStore = {
    common: {
        routeTo: mockRouteTo,
    },
};
describe('RoutePromptDialogStore', () => {
    it('should set should_show to be false', () => {
        const store = new RoutePromptDialogStore();
        expect(store.should_show).toBe(false);
    });

    it('should set is_confirmed to be false', () => {
        const store = new RoutePromptDialogStore();
        expect(store.is_confirmed).toBe(false);
    });

    it('should set last_location to be null', () => {
        const store = new RoutePromptDialogStore();
        expect(store.last_location).toBe(null);
    });

    it('should update should_show', () => {
        const store = new RoutePromptDialogStore();
        store.setShoudShow(true);
        expect(store.should_show).toBe(true);
    });

    it('should update should_show to false on onCancel', () => {
        const store = new RoutePromptDialogStore();
        store.onCancel();
        expect(store.should_show).toBe(false);
    });

    it('should set should_show to false and is_confirmed to true on onConfirm', () => {
        const store = new RoutePromptDialogStore();
        store.onConfirm();
        expect(store.should_show).toBe(false);
        expect(store.is_confirmed).toBe(true);
    });

    it('should return false for shouldNavigateAfterPrompt if is_confirmed is false', () => {
        const store = new RoutePromptDialogStore();
        const next_location = '/bot';
        store.shouldNavigateAfterPrompt(next_location);
        expect(store.last_location).toEqual(next_location);
    });

    it('should return true for shouldNavigateAfterPrompt if is_confirmed is true', () => {
        const store = new RoutePromptDialogStore();
        store.onConfirm();
        const next_location = { pathname: '/bot' };
        expect(store.shouldNavigateAfterPrompt(next_location)).toBe(true);
    });

    it('should set should_show to true if location pathname not equal to bot', () => {
        const store = new RoutePromptDialogStore();
        store.setShoudShow(true);
        let next_location = '';
        store.shouldNavigateAfterPrompt(next_location);
        expect(store.last_location).not.toEqual((next_location = '/bot'));
        expect(store.should_show).toBe(true);
    });

    it('should not call common.routeTo when is_confirmed is false on continueRoute', () => {
        const store = new RoutePromptDialogStore(null, mockCommonStore);
        store.continueRoute();
        expect(mockRouteTo).not.toHaveBeenCalled();
    });

    it('should call common.routeTo when is_confirmed is true on continueRoute', () => {
        const store = new RoutePromptDialogStore(null, mockCommonStore);
        store.last_location = { pathname: '/bot' };
        store.onConfirm();
        store.continueRoute();
        expect(mockRouteTo).toHaveBeenCalled();
    });
});
