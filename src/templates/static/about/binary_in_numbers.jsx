import React from 'react';

const Numbers = ({ className, header, text, image }) => (
    <div className={className}>
        <span className='icon' />
        <div className='inner center-text'>
            <h2 data-anchor={className}>{header}</h2>
            <p>{text}</p>
            <img className='chart' src={it.url_for(`images/pages/binary_in_numbers/charts/${image}.svg`)} />
        </div>
    </div>
);

const BinaryInNumbers = () => (
    <React.Fragment>
        <div className='gr-padding-10 static_full'>
            <h1 className='center-text'>{it.L('[_1] in Numbers', it.website_name)}</h1>
            <p className='center-text'>{it.L('In business since 2000, [_1] is the world\'s leading binary options company.', it.website_name)}</p>
        </div>
        <div className='stacked-charts'>
            <Numbers
                className='client'
                header={it.L('Active trading clients')}
                text={it.L('Our active client base is expected to reach over 100,000 total clients this year.')}
                image='chart-active-trading-clients'
            />
            <Numbers
                className='transaction'
                header={it.L('Number of transactions')}
                text={it.L('We\'re projected to register over 197 million transactions this year, bringing the total number of contracts that were bought and sold on our platform since inception to over 789 million.')}
                image='chart-num-transactions'
            />
            <Numbers
                className='turnover'
                header={it.L('Turnover')}
                text={it.L('We\'re expected to generate over USD 1 billion in turnover this year, bringing our total turnover since inception to over USD 5.7 billion.')}
                image='chart-turnover'
            />
            <Numbers
                className='withdrawal'
                header={it.L('Client withdrawals')}
                text={it.L('Client withdrawals prior to this year amounted to almost USD 500 million. More than USD 140 million worth of client withdrawals is expected this year.')}
                image='chart-client-withdrawals'
            />
            <Numbers
                className='employee'
                header={it.L('Number of employees and contractors')}
                text={it.L('We\'ve grown in size over the years - both in terms of manpower and offices. We currently have over [_1] employees across three offices in Malaysia and Malta. Further growth in headcount is expected this year to cater to the increased demand in our products and services.', '200')}
                image='chart-num-employees'
            />
        </div>
    </React.Fragment>

);

export default BinaryInNumbers;
