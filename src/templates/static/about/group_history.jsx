import React from 'react';

const UL = ({ className, items = [] }) => {
    let class1;
    if (className) {
        class1 = className;
    }
    return (
        <ul className={class1}>
            { items.map((item, idx) => (
                <li key={idx} className={ item.className ? item.className : undefined }>
                    { item.header ?
                        <React.Fragment>
                            <div className='header'>
                                {item.header}
                            </div>
                            <div className='event-body'>
                                {item.text}
                            </div>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            {item.text}
                        </React.Fragment>
                    }
                </li>
            ))}
        </ul>
    );
};

const GroupHistory = () => (
    <div className='container'>
        <div className='gr-padding-10 static_full'>
            <h1 className='center-text'>{it.L('[_1]\'s remarkable history', it.website_name)}</h1>
        </div>

        <div className='gr-padding-10'>
            <div className='timeline'>
                <UL items={[
                    { className: 'year center-text',                                                           text: '2019' },
                    { className: 'event',                header: it.L('New office in Asunción, Paraguay'),     text: it.L('[_1] opens new hub of operations in the capital of Paraguay to drive our growth in South America.', it.website_name) },
                    { className: 'year center-text',                                                           text: '2018' },
                    { className: 'event right',          header: it.L('New office in Labuan, Malaysia'),       text: it.L('[_1] opens new office in the island of Labuan as part of our business expansion.', it.website_name) },
                    { className: 'event featured',       header: it.L('Global Brands Awards 2018'),            text: it.L('[_1] is awarded \'Best Trading Platform in Asia\' by Global Brands Magazine. The Global Brands Awards honours excellence in performance and exceptional service delivery. ', it.website_name) },
                    { className: 'event right featured', header: it.L('Global Banking & Finance Awards 2018'), text: it.L('[_1] wins \'Best Binary Company Asia Pacific\' in the Global Banking & Finance Awards 2018. This reflects our expertise and leadership in innovation and strategy.', it.website_name) },

                    { className: 'year center-text',                                                                      text: '2017' },
                    { className: 'event',                header: it.L('Personal Wealth Awards 2017'),                     text: it.L('[_1] is awarded Best Binary Options Broker by the UK-based Online Personal Wealth Awards 2017, as voted by investors worldwide.', it.website_name) },
                    { className: 'event right featured', header: it.L('[_1] launches Bitcoin accounts', it.website_name), text: it.L('[_1] launches Bitcoin (BTC) accounts for non-EU customers.', it.website_name) },

                    { className: 'year center-text',                                                            text: '2016' },
                    { className: 'event featured',       header: it.L('Binary KK granted Japan license'),       text: it.L('Binary\'s Japanese subsidiary Binary KK is licensed by the KLFB as a Type 1 Financial Instruments Business in Japan.') },
                    { className: 'event right',          header: it.L('Kuala Lumpur Office'),                   text: it.L('[_1] opens an office in the QSentral office building in central Kuala Lumpur to further expand its IT development team.', it.website_name) },
                    { className: 'event',                header: it.L('Binary Bot released'),                   text: it.L('[_1] introduces an [_2]auto-trader programming tool[_3], allowing clients to develop their own automated trading robots with “drag-and-drop” simplicity.', it.website_name, '<a href="https://bot.binary.com" target="_blank" rel="noopener noreferrer">', '</a>') },
                    { className: 'event right featured', header: it.L('[_1] Shop introduced', it.website_name), text: it.L('[_1] launches an [_2]e-commerce site for branded merchandise[_3] – enabling clients, affiliates, and developers to buy and sell [_1] products.', it.website_name, '<a href="https://shop.binary.com" target="_blank" rel="noopener noreferrer">', '</a>') },
                    { className: 'event',                header: it.L('MENA FFXPO Award'),                      text: it.L('[_1] is honoured as the world\'s "Best Binary Options Broker" at the 16th annual MENA International Financial Conference and Exhibition, hosted in Dubai.', it.website_name) },

                    { className: 'year center-text',                                                                               text: '2015' },
                    { className: 'event',                header: it.L('EGR Operator Award'),                                       text: it.L('[_1] takes home first prize in the Financial Betting Operator category at the prestigious 2015 EGR Operator Awards ceremony, hosted in London.', it.website_name) },
                    { className: 'event right',          header: it.L('1 million transactions/day'),                               text: it.L('[_1]\'s systems are now processing in excess of 1 million transactions/day (including virtual accounts).', it.website_name) },
                    { className: 'event featured',       header: it.L('Binary granted Investment Services license'),               text: it.L('Binary\'s Maltese subsidiary Binary Investments (Europe) Ltd. is granted a Category 3 Investment Services license by the Malta Financial Services Authority.') },
                    { className: 'event right',          header: it.L('Binary opens Japan office'),                                text: it.L('Binary\'s Japanese subsidiary Binary KK opens an office in Tokyo and starts the process of applying for relevant licenses.') },
                    { className: 'event',                header: it.L('[_1] reaches 1 million registered users', it.website_name), text: it.L('[_1] hits 1 million users, reaching a historic milestone. The company continues to see exponential growth and this reconfirms its position as an industry leader.', it.website_name) },
                    { className: 'event right featured', header: it.L('Regent Pacific transaction'),                               text: it.L('Regent Pacific Group Ltd., the Hong Kong-listed founding shareholder of [_1], [_2]disposes of its stake[_3] at a valuation of US$ 50.5 million.', it.website_name, '<a href="http://www.regentpac.com/ICMServlet/download/13-1907-3066/EAnnt-ThirdPartiesSale(04Mar2015).pdf" target="_blank" rel="noopener noreferrer">', '</a>') },

                    { className: 'year center-text',                                                                                               text: '2014' },
                    { className: 'event right featured', header: it.L('[_1] reaches $2 billion turnover since starting in 1999', it.website_name), text: it.L('[_1] has over 800,000 clients in its database and reaches the US$ 2 billion milestone in our 15th year, making us one of the leading binary options providers.', it.website_name) },
                    { className: 'event featured',       header: it.L('Regent Markets Group Ltd. renames to Binary Ltd.'),                         text: it.L('Regent Markets Group Ltd. renames to Binary Ltd., harmonising company and website branding throughout the organisation.') },
                    { className: 'event right',          header: it.L('[_1] offers new ways to trade', it.website_name),                           text: it.L('Fifteen years on, and we\'re still innovating, growing and working on new ways to serve our customers better. For the first time, we offer short-term touch/no-touch trades and introduce a new charting application. We believe we have the most competitive and comprehensive digital options platform available to the retail public.') },
                    { className: 'event',                header: it.L('[_1] continues to innovate and grow', it.website_name),                     text: it.L('Our customers clearly like us. In mid-2014, [_1] has over 100 million historical transactions and over 130,000 new daily transactions.', it.website_name) },

                    { className: 'year center-text',                                                                                       text: '2013' },
                    { className: 'event featured',       header: it.L('BetOnMarkets.com is successfully rebranded [_1]', it.website_name), text: it.L('We rebrand BetOnMarkets.com as [_1]. The rebranding is a natural evolution for the platform as it continues to grow market share in the highly competitive field of binary trading. The new brand reflects the nature of the business, and our new tagline - Sharp Prices, Smart Trading - communicates our ethos and commitment to our clients.', `<a target="_blank" href="${it.url_for('/')}">www.${it.website_name}</a>`) },

                    { className: 'year center-text', text: '2012' },
                    { className: 'event right featured', header: it.L('BetOnMarkets.com reaches $1 billion turnover since starting in 1999', it.website_name), text: it.L('BetOnMarkets.com has over 400,000 clients in its database and reach the US$ 1 billion milestone in only our 13th year, making us one of the leading fixed-odds trading providers.') },
                    { className: 'event featured',       header: it.L('\'Best Fixed-Odds Firm 2012\' award by Global Banking and Finance Review'),             text: it.L('Another major award. This time we\'re nominated by the online readers of Global Banking and Finance Review and judged by a panel of industry experts and analysts who recognise our 13 years of platform reliability, range of trades, pricing, customer service and extensive knowledge.') },
                    { className: 'event right',          header: it.L('BetOnMarkets.com increases payouts to 100,000 USD, EUR, GBP and AUD'),                  text: it.L('Times are changing. We increase payouts so our clients can make the most of their winning trades.') },

                    { className: 'year center-text',                                                                  text: '2011' },
                    { className: 'event',       header: it.L('Regent Markets granted two new US patents'),            text: it.L('We\'re granted patents for \'Computer trading system and method for speculating on a financial market\' and \'Computer trading system for offering custom financial market speculations\'. The patents show our ability to innovate and stay ahead of the pack.') },
                    { className: 'event right', header: it.L('\'Best Fixed-Odds Broker\' silver award by Trade2Win'), text: it.L('This is another award we really savour. Trade2win is a portal for active traders seeking to profit from stocks, futures, options and forex, and these traders award us silver (we are just pipped for gold by Betfair). It means active traders worldwide rate our trading platform extremely highly.') },

                    { className: 'year center-text',                                                                                           text: '2009' },
                    { className: 'event featured', header: it.L('\'Best Fixed-Odds Financial Trading Provider\' award by Shares Magazine UK'), text: it.L('For the third straight year, BetOnMarkets.com is voted \'Best Fixed-Odds Financial Trading Provider\' by Shares Magazine UK. It\'s the last time we win it because Shares Magazine stops awarding in this category.') },
                    { className: 'event right',    header: it.L('\'Financial Betting Operator of the Year\' award by eGaming Review'),         text: it.L('A panel featuring industry leaders awards BetOnMarkets.com \'Financial Betting Operator of the Year\' over two other finalists. It\'s a major victory for our brand and further recognition of our world-beating service. Ten years on, and going from strength to strength.') },
                    { className: 'event',          header: it.L('Regent Markets acquires BetsForTraders client base'),                         text: it.L('Our fast organic growth is supplemented by the acquisition of the client base of BetsForTraders, one of our main competitors.') },

                    { className: 'year center-text',                                                                                                           text: '2008' },
                    { className: 'event right',    header: it.L('\'Best Fixed-Odds Financial Trading Provider\' award by Shares Magazine UK'),                 text: it.L('We do it again. BetOnMarkets.com follows up our 2007 award by being voted \'Best Fixed-Odds Financial Trading Provider\' for 2008.') },
                    { className: 'event featured', header: it.L('\'Best Customer Communication Firm\' award by Investors Chronicle'),                          text: it.L('We\'re really proud of this award. We\'re strongly committed to offering an ethical and customer-focused trading experience, and the award shows that BetOnMarkets is a trusted brand that listens and caters to customers, whether they are experienced traders or novices. We offer customer services in English, Indonesian, Russian, Chinese and Spanish.') },
                    { className: 'event right',    header: it.L('\'Best Fixed-Odds Financial Provider\' award by Financial Times and Investors Chronicle UK'), text: it.L('This is big. We pick up a double award from the Financial Times and Investors Chronicle, reflecting our success in improving the quality and usability of our website and products.') },

                    { className: 'year center-text',                                                                                                 text: '2007' },
                    { className: 'event',                header: it.L('Regent Markets granted US patent for \'Betting system and method\''),         text: it.L('The patent means Regent Markets is the recognised pioneer of binary betting. The patent helps protect our innovations.') },
                    { className: 'event right featured', header: it.L('\'Best Fixed-Odds Financial Trading Provider\' award by Shares Magazine UK'), text: it.L('Only five years after inception, we pick up this major award for our online trading services. The award recognises BetOnMarkets.com\'s reliable, fast and secure online trading for novice and expert traders. At this time, our website has received over 15 million trades.') },

                    { className: 'year center-text',                                                                                text: '2004' },
                    { className: 'event',       header: it.L('Regent Markets sets up a programming centre in Cyberjaya, Malaysia'), text: it.L('It\'s time to expand. We set up a programming center in Cyberjaya - the Silicon Valley of Kuala Lumpur - to maintain and improve BetOnMarkets.com.') },
                    { className: 'event right', header: it.L('Regent Markets obtains a licence in the Isle of Man'),                text: it.L('Our company continues to thrive and obtains a license in the Isle of Man to better service our UK clients.') },

                    { className: 'year center-text',                                                                                         text: '2000' },
                    { className: 'event featured', header: it.L('BetOnMarkets goes live'),                                                   text: it.L('In April, [_1]Betonmarkets.com[_2] (formerly known as [_3]Xodds.com[_2]) goes live, establishing a round-the-clock financial betting service on a variety of financial indices. Business grows quickly, and we soon become the market leader in fixed-odds financial betting.', '<a target=\'_blank\' href=\'http://www.betonmarkets.com\' rel=\'noopener noreferrer\'>', '</a>', '<a target=\'_blank\' href=\'http://www.xodds.com\' rel=\'noopener noreferrer\'>') },
                    { className: 'event right',    header: it.L('Regent Markets files for patent, and registers BetOnMarkets trading name'), text: it.L('Regent Markets files for a patent in March 2000 on the basis of our unique position as the sole serious competitor in the business of fixed-odds financial betting. In May, we register the trading name BetOnMarkets and move to Malta to receive an internet betting licence.') },

                    { className: 'year center-text',                                                                                              text: '1999' },
                    { className: 'event featured', header: it.L('Regent Markets receives funding to provide on-line financial betting services'), text: it.L('In October 1999, Regent Markets receives US$ 2 million investment funding from Jim Mellon through his Regent Pacific Group, a Hong Kong based fund management company.') },
                    { className: 'event right',    header: it.L('Regent Markets is founded by Jean-Yves Sireau'),                                 text: it.L('In classic Silicon Valley style, Hong Kong based hedge fund manager and entrepreneur, Jean-Yves Sireau, starts Regent Markets in his Hong Kong bedroom. He develops the systems, methods and algorithms for implementing a fixed-odds financial betting system. Jean-Yves\'s vision is to create a market in the simplest of all derivatives contracts - the fixed-odds bet - and to offer ordinary investors the chance to make small bets. Until his innovation, binary options are normally only traded in large quantities.') },
                ] }
                />
            </div>
        </div>
    </div>
);

export default GroupHistory;
