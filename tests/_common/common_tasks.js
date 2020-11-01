/**
 * Switch to Virtual Account
 * @param page
 * @returns {Promise<void>}
 */
async function switchVirtualAccount(page) {
    await page.waitForSelector('.acc-info', {
        timeout: 120000,
    });
    await page.click('.acc-info');
    const account_switcher_virtual = "div.acc-switcher__wrapper.acc-switcher__wrapper--enter-done > div > div.dc-tabs.dc-tabs.dc-tabs--acc-switcher__list-tabs > ul > li:nth-child(2)";
    await page.click(account_switcher_virtual);
    await page.click('.acc-switcher__id');

    // switch to virtual
    // click on account
    // wait until purchase_btn is enabled
}
async function loginPageShouldBeOpen() {}
async function openRecentPositionsDrawer() {}
async function loginToQA() {
    // visit qabox
    // enter username ${QABOX_USR}
    // enter password ${QABOX_USR_PASS}
    // enter duo_code ${QABOX_USER_CODE}
}

module.exports = {
    switchVirtualAccount,
}
