import CandleInterface     from 'TradeEngine/Interface/CandleInterface';
import IndicatorsInterface from 'TradeEngine/Interface/IndicatorsInterface';
import MiscInterface       from 'TradeEngine/Interface/MiscInterface';

// prettier-ignore
export default Interface => class extends IndicatorsInterface(
    MiscInterface(CandleInterface(Interface))) {
    getToolsInterface() {
        return {
            getTime: () => parseInt(new Date().getTime() / 1000),
            ...this.getCandleInterface(),
            ...this.getMiscInterface(),
            ...this.getIndicatorsInterface(),
        };
    }
};
