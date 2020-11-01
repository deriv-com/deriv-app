const qawolf = require("qawolf");

const MARKET_SELECT = '.cq-symbol-select-btn';
const RECENT_POSITION_DRAWER_SELECTOR = '#dt_positions_toggle';
const SIMPLE_DURATION_TOGGLE_SELECTOR = '#dt_simple_duration_toggle';

async function chooseUnderlying(page) {
    await waitForChart(page);
    await page.click(MARKET_SELECT); // Click market select
    await page.fill('.data-hj-whitelist', 'Volatility');
    await page.click('.market_dropdown-subcategory-item-1HZ10V');
    await qawolf.assertElementText(page, ".cq-symbol", 'Volatility 10 (1s) Index');
}

async function chooseContractType(page, trade_types, contract) {
    await page.click(".trade-container__fieldset.trade-types");
    await page.waitForSelector('.contract-type-dialog.contract-type-dialog--enterDone .contract-type-dialog__wrapper');
    await chooseContract(page, contract);
}

async function chooseContract(page, contract) {
    await page.click(`#dt_contract_${contract}_item`);
    await page.waitForSelector(`span[name=contract_type][value=${contract}]`);
}

async function waitForPurchaseBtnEnabled(page) {
    await page.waitForSelector('#dt_purchase_call_button:enabled', { timeout: 120000 });
    await page.waitForSelector('#dt_purchase_put_button:enabled', { timeout: 120000 });
}

async function waitForChart(page) {
    await page.waitForSelector('.chart-container__loader', {state: 'hidden', timeout: 120000});
    await page.waitForSelector('.ciq-menu.ciq-enabled', {timeout: 120000});
}

async function openRecentPositionsDrawer(page) {
    await page.waitForSelector(RECENT_POSITION_DRAWER_SELECTOR);
    await page.click(RECENT_POSITION_DRAWER_SELECTOR);
    await page.waitForSelector('positions-toggle--has-count', {state: 'hidden'});
}

async function setDuration(page, duration_unit, duration_amount) {
    await page.waitForSelector(SIMPLE_DURATION_TOGGLE_SELECTOR);
    if (duration_amount !== 5) {
        await page.click(`.range-slider__ticks span:nth-child(${duration_amount - 5})`);
    }
    if (duration_unit === 'Ticks') {
        await page.click('#dc_t_toggle_item');
    } else if (duration_unit === 'Minutes') {
        await page.click('#dc_m_toggle_item');
    }

    await qawolf.assertElementText(page, '#dt_range_slider_label', `${duration_amount} ${duration_unit}`);
}

async function buyRiseContract(page, tradeTypes, contract, duration_unit, duration_amount) {
    await chooseContractType(page, tradeTypes, contract);
    await setDuration(page, duration_unit, duration_amount);
    await waitForChart(page);
    await waitForPurchaseBtnEnabled(page);
    await page.click('#dt_purchase_call_button');
    await verifyContractResult(page);
}

async function verifyContractResult(page) {
    await page.waitForSelector('.portfolio-empty__wrapper', {state: 'hidden'});
    await page.waitForSelector('.dc-result__close-btn');
    await page.waitForSelector('.dc-contract-card__wrapper');
}

module.exports = {
    buyRiseContract,
    waitForChart,
    waitForPurchaseBtnEnabled,
    chooseContractType,
    chooseUnderlying,
    openRecentPositionsDrawer,
}
