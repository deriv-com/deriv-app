import { observer as globalObserver } from '../../../utils/observer';
import { createDetails } from '../utils/helpers';
import { isSellAtMarketAvailable, sellAtMarket } from '../trade/Sell';
import { getSellPrice } from '../trade/OpenContract';
import { purchase } from '../trade/Purchase';
import { getPurchaseReference } from '../trade/Proposal';
import { initTradeEngine, startTradeEngine } from '../trade';
import $scope from '../utils/cliTools';

const getProposal = contract_type => {
    return $scope.data.proposals.find(
        proposal => proposal.contract_type === contract_type && proposal.purchase_reference === getPurchaseReference()
    );
};

const getBotInterface = () => {
    const getDetail = i => createDetails($scope.data.contract)[i];

    return {
        init: (...args) => initTradeEngine(...args),
        start: (...args) => startTradeEngine(...args),
        // [Todo] we need initialize $scope on stop tradeEngine
        // stop: (...args) => tradeEngine.stop(...args),
        purchase: contract_type => purchase(contract_type),
        getAskPrice: contract_type => Number(getProposal(contract_type).ask_price),
        getPayout: contract_type => Number(getProposal(contract_type).payout),
        getPurchaseReference: () => getPurchaseReference(),
        isSellAvailable: () => isSellAtMarketAvailable(),
        sellAtMarket: () => sellAtMarket(),
        getSellPrice: () => getSellPrice(),
        isResult: result => getDetail(10) === result,
        isTradeAgain: result => globalObserver.emit('bot.trade_again', result),
        readDetails: i => getDetail(i - 1),
    };
};

export default getBotInterface;
