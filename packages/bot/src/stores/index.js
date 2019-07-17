import BotStore         from './bot-store';
import TutorialStore    from './tutorial-store';

export default class RootStore {
    bot = new BotStore();
    tutorial = new TutorialStore();
}
