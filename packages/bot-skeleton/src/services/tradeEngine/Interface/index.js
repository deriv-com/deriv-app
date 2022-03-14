import getToolsInterface from './ToolsInterface';
import getTicksInterface from './TicksInterface';
import getBotInterface from './BotInterface';
import TradeEngine from '../trade';

const sleep = (observer, arg = 1) => {
    return new Promise(
        r =>
            setTimeout(() => {
                r();
                setTimeout(() => observer.emit('CONTINUE'), 0);
            }, arg * 1000),
        () => {}
    );
};
export default class Interface {
    constructor($scope) {
        this.tradeEngine = new TradeEngine($scope);
        this.api = $scope.api;
        this.observer = $scope.observer;
        this.$scope = $scope;
    }

    getInterface() {
        return {
            ...getBotInterface(this.tradeEngine),
            ...getToolsInterface(this.tradeEngine),
            getTicksInterface: getTicksInterface(this.tradeEngine),
            watch: (...args) => this.tradeEngine.watch(...args),
            sleep: (...args) => sleep(this.observer, ...args),
            alert: (...args) => alert(...args), // eslint-disable-line no-alert
            prompt: (...args) => prompt(...args), // eslint-disable-line no-alert
            console: {
                log(...args) {
                    // eslint-disable-next-line no-console
                    console.log(new Date().toLocaleTimeString(), ...args);
                },
            },
        };
    }
}
