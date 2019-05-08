import React from 'react';
import ReactDOM from 'react-dom';
import Symbols from './symbols';
// Should be remove in the future
import Defaults from './defaults';
import { getElementById } from '../../../_common/common_functions';
import { localize } from '../../../_common/localize';

function scrollToPosition (element, to, duration) {
    const requestAnimationFrame = window.requestAnimationFrame ||
        function (...args) {
            return setTimeout(args[0], 10);
        };
    if (duration <= 0) {
        element.scrollTop = to;
        return;
    }
    const difference = to - element.scrollTop;
    const per_tick = difference / duration * 10;
    requestAnimationFrame(() => {
        element.scrollTop += per_tick;
        if (element.scrollTop === to) return;
        scrollToPosition(element, to, duration - 10);
    }, 20);
}

const List = ({
    arr,
    saveRef,
    underlying,
    onUnderlyingClick,
}) => (
    arr.map(([market_code, obj], idx) => (
        <div
            className='market'
            key={idx}
            id={`${market_code}_market`}
            ref={saveRef.bind(null,market_code)}
        >
            <div className='market_name'>
                {obj.name}
            </div>
            {Object.entries(obj.submarkets).sort((a, b) => submarketSort(a[0], b[0]))
                .map(([key, submarket], idx_2) => ( // eslint-disable-line no-unused-vars
                    <div className='submarket' key={idx_2}>
                        <div className='submarket_name'>
                            {submarket.name}
                        </div>
                        <div className='symbols'>
                            {Object.entries(submarket.symbols).map(([u_code, symbol]) => (
                                <div
                                    className={`symbol_name ${u_code === underlying ? 'active' : ''}`}
                                    key={u_code}
                                    id={u_code}
                                    onClick={onUnderlyingClick.bind(null, u_code, market_code)}
                                >
                                    {symbol.display}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
        </div>
    ))
);

const submarket_order = {
    forex          : 0,
    major_pairs    : 1,
    minor_pairs    : 2,
    smart_fx       : 3,
    indices        : 4,
    asia_oceania   : 5,
    europe_africa  : 6,
    americas       : 7,
    otc_index      : 8,
    stocks         : 9,
    au_otc_stock   : 10,
    ge_otc_stock   : 11,
    india_otc_stock: 12,
    uk_otc_stock   : 13,
    us_otc_stock   : 14,
    commodities    : 15,
    metals         : 16,
    energy         : 17,
    volidx         : 18,
    random_index   : 19,
    random_daily   : 20,
    random_nightly : 21,
};

const submarketSort = (a, b) => {
    if (submarket_order[a] > submarket_order[b]) {
        return 1;
    } else if (submarket_order[a] < submarket_order[b]) {
        return -1;
    }
    return 0;
};

class Markets extends React.Component {
    constructor (props) {
        super(props);
        let market_symbol = Defaults.get('market');
        this.markets = Symbols.markets();

        this.underlyings = Symbols.getAllSymbols() || {};
        let underlying_symbol = Defaults.get('underlying');
        if (!underlying_symbol || !this.underlyings[underlying_symbol]) {
            const submarket = Object.keys(this.markets[market_symbol].submarkets).sort(submarketSort)[0];
            underlying_symbol = Object.keys(this.markets[market_symbol].submarkets[submarket].symbols).sort()[0];
        }
        const markets_arr = Object.entries(this.markets).sort((a, b) => submarketSort(a[0], b[0]));
        this.markets_all = markets_arr.slice();
        if (!(market_symbol in this.markets)) {
            market_symbol = Object.keys(this.markets).find(m => this.markets[m].submarkets[market_symbol]);
            Defaults.set('market', market_symbol);
        }
        this.el_underlying = getElementById('underlying');
        this.references = {};
        this.state = {
            open  : false,
            market: {
                symbol: market_symbol,
                name  : this.markets[market_symbol].name,
            },
            underlying: {
                symbol: underlying_symbol,
                name  : this.underlyings[underlying_symbol],
            },
            markets                : markets_arr,
            active_market          : market_symbol,
            query                  : '',
            open_dropdown_scroll_id: 0,
        };
        this.el_underlying.value = underlying_symbol;
    }

    componentDidMount () {
        document.body.addEventListener('click', this.handleClickOutside);
    }

    componentWillUnmount () {
        document.body.removeEventListener('click', this.closeDropdown);
    }

    /* eslint-disable no-undef */
    closeDropdown = () => {
        this.setState({
            open   : false,
            query  : '',
            markets: this.markets_all,
        });
    };

    getCurrentUnderlying = () => {
        const { underlying: { name: underlying } } = this.state;
        const max_char = window.innerWidth <= 767 ? 15 : 25;
        if (underlying.length > max_char) {
            return `${underlying.substr(0, max_char)}...`;
        }
        return underlying;
    }

    handleClickOutside = (e) => {
        if (this.references.wrapper_ref
            && !this.references.wrapper_ref.contains(e.target)
            && this.state.open) {
            this.closeDropdown();
        }
    }

    handleScroll = (e) => {
        const { market_nodes, list } = this.references;
        const position = e.target.scrollTop + list.offsetTop;
        const arr = [];
        let curr_market = null;
        Object.entries(market_nodes).forEach(([key, node]) => {

            if (node && node.offsetParent && node.offsetTop - 41 <= position) {
                arr.push(key);
            }
        });
        if (this.state.active_market !== arr[arr.length - 1]) {
            if (position <= 10) {
                curr_market = arr[0];
            } else {
                curr_market = arr[arr.length - 1];
            }
            this.setState({ active_market: curr_market });
        }

        this.stickyHeader(position);
    }

    openScrollMonitor = (element) => {
        // if there is no scroll, we don't need to register anything.
        if (element.scrollHeight < element.clientHeight) return;
        const forceScroll = (e) => {
            e.scrollTop += 1;
            e.scrollTop -= 1;
        };
        this.setState({
            open_dropdown_scroll_id: setInterval(forceScroll.bind(null, element), 300),
        });
        setTimeout(() => {
            this.closeScrollMonitor();
        }, 1500);
    }

    closeScrollMonitor = () => {
        clearInterval(this.state.open_dropdown_scroll_id);
        this.setState({
            open_dropdown_scroll_id: 0,
        });
    }

    openDropdown = () => {
        this.setState({ open: true });
        Object.values(this.references.market_nodes).forEach((node) => {
            node.classList.remove('put_under');
            node.removeAttribute('style');
            node.children[0].classList.remove('sticky');
            node.children[0].removeAttribute('style');
        });
        this.references.list.scrollTop = 0;
        this.scrollToElement(this.state.underlying.symbol, 0, 70);
        const scrollable = document.querySelector('.markets_dropdown .list');
        this.openScrollMonitor(scrollable);
    };

    onUnderlyingClick = (underlying_symbol, market_symbol) => {
        Defaults.set('underlying', underlying_symbol);
        Defaults.set('market', market_symbol);

        this.setState({
            market: {
                symbol: market_symbol,
                name  : this.markets[market_symbol].name,
            },
            underlying: {
                symbol: underlying_symbol,
                name  : this.underlyings[underlying_symbol],
            },
        });

        // Trigger change event.
        // TODO: move this block to componentDidUpdate
        this.el_underlying.value = underlying_symbol;
        this.el_underlying.setAttribute('data-text',this.underlyings[underlying_symbol]);
        const event = new Event('change');
        this.el_underlying.dispatchEvent(event);

        this.closeDropdown();
        /* Todo add notification for closed markets */
        // Notifications.show({ text: localize('All markets are closed now. Please try again later.'), uid: 'MARKETS_CLOSED' });

    }

    onTabChange = (e) => {
        const market = e.target.dataset.market;
        this.scrollToElement(`${market}_market`, 120, 0);
    }

    saveRef = (node_name, node) => this.references[node_name] = node;

    scrollToElement = (id, duration = 120, offset = 0) => {
        // handleScroll is triggered automatically which sets the active market.
        const { list } = this.references;
        const to_offset = getElementById(id).offsetTop - list.offsetTop - offset;
        scrollToPosition(list, to_offset, duration);
    }

    stickyHeader = (position) => {
        const { market_nodes } = this.references;
        const class_sticky = 'sticky';
        const class_under = 'put_under';
        const TITLE_HEIGHT = 40;
        const DEFAULT_TOP = this.references.list.offsetTop;

        const current_viewed_node = Object.values(market_nodes).find(node => (
            node.dataset.offsetTop <= position
                && +node.dataset.offsetHeight + +node.dataset.offsetTop > position
        ));

        if (current_viewed_node !== this.references.last_viewed_node) {
            Object.values(market_nodes).forEach(node => {
                node.removeAttribute('style');
                node.children[0].removeAttribute('style');
                node.children[0].classList.remove(class_under, class_sticky);
            });
            this.references.last_viewed_node = current_viewed_node;
        }

        const diff = (+current_viewed_node.dataset.offsetHeight + +current_viewed_node.dataset.offsetTop) - position;
        if (diff > 0 && diff < TITLE_HEIGHT) {
            current_viewed_node.children[0].style.top = `${DEFAULT_TOP - (TITLE_HEIGHT - diff)}px`;
            current_viewed_node.children[0].classList.add(class_under);
        } else {
            current_viewed_node.children[0].removeAttribute('style');
            current_viewed_node.children[0].classList.remove(class_under);
        }
        current_viewed_node.children[0].classList.add(class_sticky);
        current_viewed_node.style.paddingTop = `${TITLE_HEIGHT}px`;
    }

    saveMarketRef = (market, node) => {
        if (!node) return;
        if (!this.references.market_nodes) this.references.market_nodes = {};
        this.references.market_nodes[market] = node;
        // Save offsets of elements for sticky headers.
        node.dataset.offsetTop = node.offsetTop;
        node.dataset.offsetHeight = node.offsetHeight;
    }

    searchSymbols = ({ target: { value: query } }) => {
        this.setState({ query });
        scrollToPosition(this.references.list, 0, 0);
        const markets_all = this.markets_all;
        if (!query) {
            this.setState({ markets: markets_all });
            return;
        }
        const filter_markets = [];
        markets_all.map(([key, market]) => {
            let found_for_market = false; // To check market contains any matching underlying.
            const filter_submarkets = {};
            Object.entries(market.submarkets).map(([key_2, submarket]) => {
                let found_for_submarket = false; // Same as found for market
                const filter_symbols = {};
                Object.entries(submarket.symbols).map(([key_3, symbol]) => {
                    const queries = query.split(',');
                    if (
                        queries.reduce((a, b) =>
                            symbol.display.toLowerCase().includes(b.toLowerCase()) || a
                        , false)
                    ) {
                        filter_symbols[key_3] = symbol;
                        found_for_market = true;
                        found_for_submarket = true;
                    }
                });
                if (found_for_submarket) {
                    filter_submarkets[key_2] = JSON.parse(JSON.stringify(submarket));
                    filter_submarkets[key_2].symbols = filter_symbols;
                }
            });
            if (found_for_market) {
                const market_copy = JSON.parse(JSON.stringify(market));
                market_copy.submarkets = filter_submarkets;
                filter_markets.push([key, market_copy]);
            }
        });

        // nothing found
        if (!filter_markets.length) return;

        this.setState({ markets: filter_markets, active_market: filter_markets[0][0] });
    }

    /* eslint-disable no-shadow */
    scrollToMarket = (key) => {
        const { list } = this.references;
        const node = this.references.market_nodes[key];
        const offset = node.dataset.offsetTop - list.offsetTop;
        scrollToPosition(list, offset, 0);
    }

    /* eslint-enable no-shadow */
    /* eslint-enable no-undef */
    render () {
        const {
            active_market,
            markets,
            underlying,
            query,
            market,
            open,
        } = this.state;
        const {
            getCurrentUnderlying,
            openDropdown,
            closeDropdown,
            searchSymbols,
            handleScroll,
            saveMarketRef,
            onUnderlyingClick,
            saveRef,
            scrollToMarket,
        } = this;
        return (
            <div className='markets'>
                <div
                    className='market_current'
                    onClick={openDropdown}
                >
                    <span className='market'>
                        {market.name}
                        <span className='arrow_down' />
                    </span>
                    <span className='underlying'>{getCurrentUnderlying()}</span>
                </div>
                <div
                    className={`markets_dropdown ${open ? '' : 'hidden'}`}
                    ref={saveRef.bind(null, 'wrapper_ref')}
                >
                    <div className='asset-placeholder mobile'>
                        <span>{localize('Select Asset')}</span>
                        <span className='close' onClick={closeDropdown} />
                    </div>
                    <div className='search'>
                        <input
                            type='text'
                            maxLength={20}
                            onInput={searchSymbols}
                            onChange={searchSymbols}
                            placeholder={localize('Search...')}
                            value={query}
                        />
                        <span className='icon' />
                    </div>
                    <div className='markets_view'>
                        <div className='markets_column'>
                            <div className='desktop'>
                                {markets.map(([key, obj]) =>
                                    <div
                                        className={`market ${active_market === key ? 'active' : ''}`}
                                        key={key}
                                        onClick={scrollToMarket.bind(null,`${key}`)}
                                    >
                                        <span className={`icon ${key} ${active_market === key ? 'active' : ''}`} />
                                        <span>{obj.name}</span>
                                    </div>
                                )}
                            </div>
                            <div className='mobile'>
                                <ul>
                                    {markets.map(([key]) => (
                                        <li
                                            onClick={scrollToMarket.bind(null, key)}
                                            key={key}
                                            data-market={key}
                                            className={active_market === key ? 'active' : ''}
                                        >
                                            <span className={`icon ${key} ${active_market === key ? 'active' : ''}`} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div
                            className='list'
                            ref={saveRef.bind(null, 'list')}
                            onScroll={handleScroll}
                        >
                            <List
                                arr={markets}
                                saveRef={saveMarketRef}
                                underlying={underlying.symbol}
                                onUnderlyingClick={onUnderlyingClick}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export const init = () => {
    ReactDOM.render(
        <Markets />,
        getElementById('underlying_component')
    );
};

export default init;
