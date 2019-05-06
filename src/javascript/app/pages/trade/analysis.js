const showChart      = require('./charts/webtrader_chart').showChart;
const Defaults       = require('./defaults');
const getActiveTab   = require('./get_active_tab').getActiveTab;
const GetTicks       = require('./get_ticks');
const MBDefaults     = require('../mb_trade/mb_defaults');
const MBPortfolio    = require('../mb_trade/mb_portfolio');
const getElementById = require('../../../_common/common_functions').getElementById;
const getLanguage    = require('../../../_common/language').get;
const State          = require('../../../_common/storage').State;
const TabSelector    = require('../../../_common/tab_selector');
const Url            = require('../../../_common/url');

/*
 * This file contains the code related to loading of trading page bottom analysis
 * content. It will contain jquery so as to compatible with old code and less rewrite
 *
 * Please note that this will be removed in near future
 */

/*
 * This function is called whenever we change market, form
 * or underlying to load bet analysis for that particular event
 */

const TradingAnalysis = (() => {
    // tabListener();
    const hidden_class    = 'invisible';
    const tab_selector_id = 'trade_analysis';

    let form_name, current_tab;

    const requestTradeAnalysis = () => {
        form_name = (State.get('is_mb_trading') ? MBDefaults.get('category') : Defaults.get('formname')) || 'risefall';

        const map_obj = { matchdiff: 'digits', callputequal: 'risefall', callput: 'higherlower' };
        form_name     = map_obj[form_name] || form_name;

        $('#tab_last_digit').setVisibility(/digits|overunder|evenodd/.test(form_name));
        sessionStorage.setItem('currentAnalysisTab', getActiveTab());
        loadAnalysisTab();
    };

    /*
     * This function bind event to link elements of bottom content
     * navigation
     */
    const bindAnalysisTabEvent = () => {
        $('#trade_analysis').find('li a').on('click', (e) => {
            e.preventDefault();
            const li = e.target.parentElement;
            sessionStorage.setItem('currentAnalysisTab', li.id);
            if (!li.classList.contains('active')) {
                loadAnalysisTab(li.id);
            }
        });

        TabSelector.onChangeTab(changeTab);
    };

    /*
     * This function handles all the functionality on how to load
     * tab according to current paramerted
     */
    const loadAnalysisTab = (tab) => {
        current_tab = tab || getActiveTab();

        $('#trade_analysis').find('li').removeClass('active');
        $(`#${current_tab}`).addClass('active');
        toggleActiveAnalysisTabs();
        MBPortfolio.init();
        if (State.get('is_mb_trading')) {
            showChart();
        }
        if (current_tab === 'tab_portfolio') {
            MBPortfolio.show();
        } else {
            MBPortfolio.hide();
            if (current_tab === 'tab_graph') {
                showChart();
            } else if (current_tab === 'tab_last_digit') {
                const $digit_underlying = $('#digit_underlying');
                const $underlying       = $('#underlying');
                const underlying        = $underlying.val();
                const underlying_text   = $underlying.attr('data-text');
                const tick              = $('#tick_count').val() || 100;

                if (underlying !== $digit_underlying.val() && $digit_underlying.val() !== null) {
                    $digit_underlying.find(`option[value="${underlying}"]`).prop('selected', true).trigger('change');
                    const $digit_underlying_dropdown = $digit_underlying.next('div.select-dropdown');

                    // check if custom dropdown exists and sync with underlying dropdown
                    if ($digit_underlying_dropdown) {
                        const $digit_underlying_list = $digit_underlying_dropdown.next('ul.select-options').children('li');
                        $digit_underlying_dropdown.text(underlying_text);
                        $digit_underlying_list.not(this).each((idx, el) => {
                            el.classList.remove('selected');
                        });
                        $digit_underlying_list.filter(`[value='${underlying}']`).addClass('selected');
                    }
                } else {
                    GetTicks.request('', {
                        ticks_history: underlying,
                        count        : tick.toString(),
                        end          : 'latest',
                    });
                }
            } else if (current_tab === 'tab_explanation') {
                showExplanation();
            }
        }
        if (current_tab) {
            const el_to_show           = getElementById(current_tab);
            const el_mobile_tab_header = getElementById('tab_mobile_header');

            TabSelector.slideSelector(tab_selector_id, el_to_show);
            if (el_mobile_tab_header) {
                el_mobile_tab_header.innerHTML = el_to_show.firstChild.innerHTML;
            }
        }

        // workaround for underline during window resize
        window.addEventListener('resize', tabSlider);
    };

    const tabSlider = () => {
        TabSelector.slideSelector(tab_selector_id, getElementById(current_tab));
    };

    const changeTab = (options) => {
        const selector_array = Array.from(getElementById(options.selector).querySelectorAll('li.tm-li:not(.invisible):not(.tab-selector)'));
        const active_index = selector_array.findIndex((x) => x.id === getActiveTab());
        let index_to_show = active_index;
        if (options.direction) {
            const array_length = selector_array.length;
            if (options.direction === 'left') {
                index_to_show = active_index - 1;
                index_to_show = index_to_show < 0 ? array_length - 1 : index_to_show;
            } else {
                index_to_show = active_index + 1;
                index_to_show = index_to_show === array_length ? 0 : index_to_show;
            }
        }
        options.el_to_show = selector_array[index_to_show].id;
        if (!options.el_to_show || !options.selector) {
            return;
        }
        sessionStorage.setItem('currentAnalysisTab', options.el_to_show);
        if (!getElementById(options.el_to_show).classList.contains('active')) {
            loadAnalysisTab(options.el_to_show);
        }
    };

    /*
     * function to toggle the active element for analysis menu
     */
    const toggleActiveAnalysisTabs = () => {
        current_tab        = getActiveTab();

        const analysis_container  = getElementById('analysis_content');
        const child_elements      = analysis_container.children;
        const current_tab_element = getElementById(`${current_tab}-content`);
        const classes             = current_tab_element.classList;

        for (let i = 0, len = child_elements.length; i < len; i++) {
            child_elements[i].classList.remove('selectedTab');
            child_elements[i].classList.add(hidden_class);
        }

        classes.add('selectedTab');
        classes.remove(hidden_class);
    };

    /*
     * handle the display of proper explanation based on parameters
     */
    const showExplanation = () => {
        const $container = $('#tab_explanation-content');
        $container.find('#explanation_winning > div, #explanation_explain > div, #explanation_image, #explanation_note, #explanation_note > div, #explanation_duration > div').setVisibility(0);
        $container.find(`#explanation_winning, #winning_${form_name}, #explanation_explain, #explain_${form_name}, #duration_${Defaults.get('market')}`).setVisibility(1);
        const market_duration = $container.find(`#duration_${form_name}`);
        if (market_duration.length) {
            market_duration.setVisibility(1);
            $(`#duration_${Defaults.get('market')}`).setVisibility(0);
        }

        if ($container.find(`#note_${form_name}`).length) {
            $(`#explanation_note, #note_${form_name}`).setVisibility(1);
        }

        const images = {
            risefall: {
                image1: 'rises.svg',
                image2: 'falls.svg',
            },
            higherlower: {
                image1: 'higher.svg',
                image2: 'lower.svg',
            },
            touchnotouch: {
                image1: 'touch.svg',
                image2: 'no-touch.svg',
            },
            endsinout: {
                image1: 'ends-between.svg',
                image2: 'ends-outside.svg',
            },
            staysinout: {
                image1: 'stays-between.svg',
                image2: 'goes-outside.svg',
            },
            digits: {
                image1: 'matches.svg',
                image2: 'differs.svg',
            },
            evenodd: {
                image1: 'even.svg',
                image2: 'odd.svg',
            },
            overunder: {
                image1: 'over.svg',
                image2: 'under.svg',
            },
            lookbackhigh: {
                image1: 'high-close.svg',
            },
            lookbacklow: {
                image1: 'close-low.svg',
            },
            lookbackhighlow: {
                image1: 'high-low.svg',
            },
            reset: {
                image1: 'reset-call.svg',
                image2: 'reset-put.svg',
            },
            callputspread: {
                image1: 'call-spread.svg',
                image2: 'put-spread.svg',
            },
            highlowticks: {
                image1: 'high-tick.svg',
                image2: 'low-tick.svg',
            },
            runs: {
                image1: 'only-ups.svg',
                image2: 'only-downs.svg',
            },
        };

        if (images[form_name]) {
            const image_path = Url.urlForStatic(`images/pages/trade-explanation/${getLanguage().toLowerCase()}/`);
            $container.find('#explanation_image_1').attr('src', image_path + images[form_name].image1);
            if (images[form_name].image2) {
                $container
                    .find('#explanation_image_2')
                    .attr('src', image_path + images[form_name].image2)
                    .parent()
                    .setVisibility(1);
            } else {
                $container.find('#explanation_image_2').parent().setVisibility(0);
            }
            $container.find('#explanation_image').setVisibility(1);
        }
    };

    const onUnload = () => {
        window.removeEventListener('resize', tabSlider);
    };

    return {
        bindAnalysisTabEvent,
        onUnload,
        request: requestTradeAnalysis,
    };
})();

module.exports = TradingAnalysis;
