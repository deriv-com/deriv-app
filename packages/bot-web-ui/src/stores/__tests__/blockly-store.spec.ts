import { onWorkspaceResize } from '@deriv/bot-skeleton';
import BlocklyStore from '../blockly-store';
import { getSetting } from '../../utils/settings';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({}));

jest.mock('@deriv/bot-skeleton', () => ({
    ...jest.requireActual('@deriv/bot-skeleton'),
    onWorkspaceResize: jest.fn(),
}));

describe('BlocklyStore', () => {
    let store: BlocklyStore;

    beforeEach(() => {
        store = new BlocklyStore({});
    });

    it('Should initialize with default values', () => {
        expect(store.is_loading).toBe(false);
        expect(store.active_tab).toBe('Workspace');
    });

    it('should set active tab correctly', () => {
        store.setActiveTab('Chart');
        expect(store.active_tab).toBe('Chart');
    });

    it('should set container size correctly for Workspace tab', () => {
        store.setActiveTab('Workspace');
        store.setContainerSize();

        expect(onWorkspaceResize).toHaveBeenCalled();
    });

    it('should get cached active tab correctly', () => {
        store.getCachedActiveTab();
        getSetting('Workspace');

        expect(store.active_tab).toBe('Workspace');
    });

    it('should set loading flag correctly', () => {
        store.setLoading(true);
        expect(store.is_loading).toBe(true);
    });

    it('should add and remove resize event listener correctly', () => {
        const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

        store.onMount();
        expect(addEventListenerSpy).toHaveBeenCalledWith('resize', store.setContainerSize);

        store.onUnmount();
        expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', store.setContainerSize);
    });
});
