import TicksInterface from './TicksInterface';
import ToolsInterface from './ToolsInterface';
import TradeEngine from '../trade';
import { createDetails } from '../utils/helpers';
import { observer as globalObserver } from '../../../utils/observer';

/**
 * Bot - Bot Module
 * @namespace Bot
 */

export default class Interface extends ToolsInterface(TicksInterface(class {})) {
    constructor($scope) {
        super();
        this.tradeEngine = new TradeEngine($scope);
        this.api = $scope.api;
        this.observer = $scope.observer;
        this.$scope = $scope;
    }

    getInterface(name = 'Global') {
        if (name === 'Bot') {
            return {
                ...this.getBotInterface(),
                ...this.getToolsInterface(),
            };
        }
        return {
            watch: (...args) => this.tradeEngine.watch(...args),
            sleep: (...args) => this.sleep(...args),
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

    getBotInterface() {
        const getDetail = i => createDetails(this.tradeEngine.data.contract)[i];

        return {
            init: (...args) => this.tradeEngine.init(...args),
            start: (...args) => this.tradeEngine.start(...args),
            stop: (...args) => this.tradeEngine.stop(...args),
            purchase: contract_type => this.tradeEngine.purchase(contract_type),
            getAskPrice: contract_type => Number(this.getProposal(contract_type).ask_price),
            getPayout: contract_type => Number(this.getProposal(contract_type).payout),
            getPurchaseReference: () => this.tradeEngine.getPurchaseReference(),
            isSellAvailable: () => this.tradeEngine.isSellAtMarketAvailable(),
            sellAtMarket: () => this.tradeEngine.sellAtMarket(),
            getSellPrice: () => this.getSellPrice(),
            isResult: result => getDetail(10) === result,
            isTradeAgain: result => globalObserver.emit('bot.trade_again', result),
            readDetails: i => getDetail(i - 1),
        };
    }

    sleep(arg = 1) {
        return new Promise(
            r =>
                setTimeout(() => {
                    r();
                    setTimeout(() => this.observer.emit('CONTINUE'), 0);
                }, arg * 1000),
            () => {}
        );
    }

    getProposal(contract_type) {
        return this.tradeEngine.data.proposals.find(
            proposal =>
                proposal.contract_type === contract_type &&
                proposal.purchase_reference === this.tradeEngine.getPurchaseReference()
        );
    }

    getSellPrice() {
        return this.tradeEngine.getSellPrice();
    }
}
