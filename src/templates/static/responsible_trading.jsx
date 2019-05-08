import React from 'react';

const ResponsibleTrading = () => (
    <div className='static_full' id='responsible-trading'>
        <div className='container'>
            <h1>{it.L('Responsible Trading')}</h1>
            <div data-show='eucountry'>
                <p>{it.L('[_1] supports [_2] which is the leading charity in Britain committed to minimising gambling-related harm. The charity funds education, prevention and treatment services and commissions research to help people understand more about gambling-related harm. It also offers a national gambling helpline to offer confidential advice and emotional support to those that seek help about their gambling.', it.website_name, '<a target=\'_blank\' href=\'https://www.begambleaware.org/about-us/\' rel=\'noopener noreferrer\'>BeGambleAware</a>')}</p>
                <p>{it.L('[_1] also provides links to an online quiz to assess a potential gambling problem and an online gambling calculator to see how much you can really spend.', '<a target=\'_blank\' href=\'https://www.begambleaware.org/\' rel=\'noopener noreferrer\'>BeGambleAware</a>')}</p>
            </div>
            <p>{it.L('Please remember at all times that trading binary options can be an exciting activity, but we have a moral duty to remind you of the risks you may run. Options trading can become a real addiction, as can any other activity pushed to its limits. We kindly ask you to engage in a careful self-analysis to check if you are at risk. To avoid the danger of such an addiction, it is important that you follow some basic principles and guidelines.')}</p>
            <ol>
                <li>{it.L('Use the opportunity provided by our website to practice for free with our virtual money account facility. This will enable you to get used to the functionalities and rules of the website.')}</li>
                <li>{it.L('Trade only with money you can afford to lose. Do not trade with borrowed money.')}</li>
                <li>{it.L('Do not trade when you are tired or are under the influence of alcohol.')}</li>
                <li>{it.L('Put a limit on your winnings. Once you have reached it put some aside and trade with the rest of the money.')}</li>
            </ol>

            <h2>{it.L('Written limits and self-exclusion')}</h2>
            <p>{it.L('[_1] provides you with the opportunity to either self-exclude or [_2]set limits on your trading activities[_3] on this website. You may also [_4]contact us[_3] to state the limits you wish to set via email or phone. Available limits are:', it.website_name, `<a href="${it.url_for('user/security/self_exclusionws')}">`, '</a>', `<a href="${it.url_for('contact')}">`)}</p>
            <ol>
                <li>{it.L('a limit on the amount you may trade within a specified period of time;')}</li>
                <li>{it.L('a limit on the losses you may incur within a specified period of time;')}</li>
                <li>{it.L('a limit on the amount of time you may trade in any given online session;')}</li>
                <li>{it.L('a definite or indefinite period during which you wish to exclude yourself from the website.')}</li>
            </ol>

            <p>{it.L('Limits 1 to 3 may only be changed or increased after 7 days\' notice.')}</p>
            <p>{it.L('Clients who wish to self-exclude should be aware that the self-exclusion period is a minimum of six months and are given the option to extend it to a total of at least five years, immediately without any cooling-off period. When the self-exclusion period is set, the balance of funds in the client\'s account will be refunded to the client. At the end of the self-exclusion period, the self-exclusion remains in place, unless positive action is taken by the client in order to trade again.')}</p>
            <p>{it.L('Clients who do not wish to renew the self-exclusion and make a request to begin trading again, shall be given one day to cool off before being allowed access to the website. It is important to note that contact must be made to our customer services via telephone. Email contact is not sufficient.')}</p>

            <div data-show='eucountry'>
                <h2>GAMSTOP</h2>
                <p>{it.L('If you are considering self-exclusion, you may wish to register with GAMSTOP.')}</p>
                <p>{it.L('GAMSTOP is a free service that enables you to self-exclude from all online gambling companies licensed in Great Britain.')}</p>
                <p>{it.L('To find out more and to sign up with GAMSTOP, please visit [_1].', '<a target="_blank" rel="noopener noreferrer" href="https://www.gamstop.co.uk">www.gamstop.co.uk</a>')}</p>

                <h2>{it.L('Underage Gambling')}</h2>
                <p>{it.L('Clients must be aware that underage gambling is an offence. If a client, upon age verification, is proven to be underage, they will be deprived of any winnings and only deposits made shall be refunded.')}</p>

                <h2>{it.L('Filtering Controls')}</h2>
                <p>{it.L('Our site can be filtered using a number of filtering systems available on the market which could be used to restrict one\'s access to our site.')}</p>
            </div>

            <h2>{it.L('Other Warnings & Regulatory Disclosures')}</h2>
            <p>{it.L('Investing in complex products, such as CFDs and FX may incur losses as well as gains. Prices may vary and/or fluctuate due to changes in current market prices and conditions, which may impact the return on your investment. Before making an Investment decision, you should refer to our [_1]Key Information Documents[_2] on our website, in particular, the amount of Margin required for particular instruments that we offer. The Products offered by Binary Investments (Europe) Ltd fall under the category of \'complex products\' and may not be suitable for retail clients.', `<a href='${it.url_for('regulation')}#key_information_documents'>`,'</a>')}</p>
        </div>
    </div>
);

export default ResponsibleTrading;
