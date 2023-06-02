import { CDPSession, Page } from '@playwright/test';
import { CONSIDERED_PERFORMANCE_FIELDS, RECORDED_PERFORMANCE_FIELDS } from './constants';
import fs from 'fs';
import path from 'path';
import { TBrowserName, TPerformanceResults } from './types';

export const switchAccountType = async (page: Page, from_type: string, to_type: string) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('.account-type-dropdown--parent', { timeout: 0 });
    await page.waitForSelector(`.account-type-dropdown--${from_type.toLowerCase()}`, { timeout: 0 });
    await page.getByTestId('dti_dropdown_display').getByText(from_type).click({ timeout: 0 });
    await page.locator(`#${to_type.toLocaleLowerCase()}`).click();
    await page.waitForLoadState('domcontentloaded');
};
export const enablePerformance = async (page: Page, browserName) => {
    let client: CDPSession | null = null;
    // Only run performance test on chromium
    if (browserName === 'chromium') {
        client = await page.context().newCDPSession(page);
        client.send('Performance.enable');
    }
    return client;
};

export const getPerformanceData = async (browserName: TBrowserName, client: CDPSession | null) => {
    const json_results = { considered_results: {}, unconsidered_results: {} };
    // Only run performance test on chromium
    if (browserName === 'chromium') {
        const performance_metics = await client?.send('Performance.getMetrics');
        const { metrics } = performance_metics || { metrics: [] };
        metrics.forEach(metric => {
            if (CONSIDERED_PERFORMANCE_FIELDS.includes(metric.name)) {
                json_results.considered_results[metric.name] = metric.value;
            } else if (RECORDED_PERFORMANCE_FIELDS.includes(metric.name)) {
                json_results.unconsidered_results[metric.name] = metric.value;
            }
        });
    }
    return json_results;
};

export const savePerformanceData = async (
    browserName,
    test_title: string,
    performance_results: Partial<TPerformanceResults>
) => {
    if (browserName === 'chromium') {
        // Only run performance test on chromium
        const file_name = `playwright-json-test-results/performance_results_${test_title
            .toLocaleLowerCase()
            .replace(/\s/g, '_')}.json`;
        const results_path = path.resolve(__dirname, `../${file_name}`);
        fs.writeFile(results_path, JSON.stringify(performance_results, null, 2), error => {
            if (error) {
                // eslint-disable-next-line no-console
                console.log('Error writing performance data to file', error);
                return;
            }
            // eslint-disable-next-line no-console
            console.log(`Performance data written to ${file_name}`);
        });
    }
};

export const getComparisonPerformanceData = async (browseName: TBrowserName, test_title: string) => {
    let parsed_results: TPerformanceResults;
    let results = '{}';
    if (browseName === 'chromium') {
        const file_name = `playwright-json-test-results/performance_results_${test_title
            .toLocaleLowerCase()
            .replace(/\s/g, '_')}.json`;
        const results_path = path.resolve(__dirname, `../${file_name}`);
        try {
            results = await fs.promises.readFile(results_path, 'utf8');
        } catch (error) {
            if (error.code === 'ENOENT') {
                // eslint-disable-next-line no-console
                console.log('File does not exist');
            } else {
                // eslint-disable-next-line no-console
                console.log('Error reading file:', error.code);
            }
        } finally {
            parsed_results = JSON.parse(results);
        }
        return parsed_results.considered_results;
    }
    return null;
};

export const checkPerformanceResults = async (
    browserName,
    test_title: string,
    performance_data: TPerformanceResults
) => {
    if (process.env.CURRENT_BRANCH === 'test_e2e') {
        savePerformanceData(browserName, test_title, performance_data);
    } else {
        const comparison_data = await getComparisonPerformanceData(browserName, test_title);
        const { considered_results } = performance_data;
        if (comparison_data) {
            return Object.keys(considered_results).every(key => {
                const original_stat = Number(comparison_data[key]);
                const difference = Number(considered_results[key]) - original_stat;
                return difference > 0.5 * original_stat;
            });
        }
    }
    return false;
};
