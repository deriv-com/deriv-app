import RoutePromptDialogStore from '../route-prompt-dialog-store';

const mockRouteTo = jest.fn();

const mockCommonStore = {
    common: {
        routeTo: mockRouteTo,
    },
};
describe('RoutePromptDialogStore', () => {
    let route_store: RoutePromptDialogStore;
    const root_store = {
        run_panel: {
            is_running: true,
        },
    };

    beforeEach(() => {
        route_store = new RoutePromptDialogStore(root_store, mockCommonStore);
    });

    it('should set should_show to be false', () => {
        expect(route_store.should_show).toBe(false);
    });

    it('should set is_confirmed to be false', () => {
        expect(route_store.is_confirmed).toBe(false);
    });

    it('should set last_location to be null', () => {
        expect(route_store.last_location).toBe(null);
    });

    it('should update should_show', () => {
        route_store.setShoudShow(true);
        expect(route_store.should_show).toBe(true);
    });

    it('should update should_show to false on onCancel', () => {
        route_store.onCancel();
        expect(route_store.should_show).toBe(false);
    });

    it('should set should_show to false and is_confirmed to true on onConfirm', () => {
        route_store.onConfirm();
        expect(route_store.should_show).toBe(false);
        expect(route_store.is_confirmed).toBe(true);
    });

    it('should return false for shouldNavigateAfterPrompt if is_confirmed is false', () => {
        const next_location = '/bot';
        route_store.shouldNavigateAfterPrompt(next_location);
        expect(route_store.last_location).toEqual(next_location);
    });

    it('should return true for shouldNavigateAfterPrompt if is_confirmed is true', () => {
        route_store.onConfirm();
        const next_location = { pathname: '/bot' };
        expect(route_store.shouldNavigateAfterPrompt(next_location)).toBe(true);
    });

    it('should set should_show to true if location pathname not equal to bot', () => {
        route_store.setShoudShow(true);
        let next_location = '';
        route_store.shouldNavigateAfterPrompt(next_location);
        expect(route_store.last_location).not.toEqual((next_location = '/bot'));
        expect(route_store.should_show).toBe(true);
    });

    it('should not call common.routeTo when is_confirmed is false on continueRoute', () => {
        route_store.continueRoute();
        expect(mockRouteTo).not.toHaveBeenCalled();
    });

    it('should call common.routeTo when is_confirmed is true on continueRoute', () => {
        route_store.last_location = { pathname: '/bot' };
        route_store.onConfirm();
        route_store.continueRoute();
        expect(mockRouteTo).toHaveBeenCalled();
    });
});
