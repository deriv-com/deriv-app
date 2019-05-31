import CandleInterface     from './CandleInterface';
import IndicatorsInterface from './IndicatorsInterface';
import MiscInterface       from './MiscInterface';

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
