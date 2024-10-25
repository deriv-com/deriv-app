import Chat from '../chat';
import getFeatureFlag from '../getFeatureFlag';

jest.mock('../getFeatureFlag');

describe('Chat Utility', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (window as any).fcWidget = {
            open: jest.fn(),
            close: jest.fn(),
        };
        (window as any).LiveChatWidget = {
            call: jest.fn(),
        };
    });

    describe('open method', () => {
        it('should call fcWidget.open when Freshchat is enabled', async () => {
            (getFeatureFlag as jest.Mock).mockResolvedValueOnce(true);

            await Chat.open();

            expect(window.fcWidget.open).toHaveBeenCalled();
            expect(window.LiveChatWidget.call).not.toHaveBeenCalled();
        });

        it('should call LiveChatWidget.call with "maximize" when Freshchat is disabled', async () => {
            (getFeatureFlag as jest.Mock).mockResolvedValueOnce(false);

            await Chat.open();

            expect(window.fcWidget.open).not.toHaveBeenCalled();
            expect(window.LiveChatWidget.call).toHaveBeenCalledWith('maximize');
        });
    });

    describe('close method', () => {
        it('should call fcWidget.close when Freshchat is enabled', async () => {
            (getFeatureFlag as jest.Mock).mockResolvedValueOnce(true);

            await Chat.close();

            expect(window.fcWidget.close).toHaveBeenCalled();
            expect(window.LiveChatWidget.call).not.toHaveBeenCalled();
        });

        it('should call LiveChatWidget.call with "minimize" when Freshchat is disabled', async () => {
            (getFeatureFlag as jest.Mock).mockResolvedValueOnce(false);

            await Chat.close();

            expect(window.fcWidget.close).not.toHaveBeenCalled();
            expect(window.LiveChatWidget.call).toHaveBeenCalledWith('minimize');
        });
    });
});
