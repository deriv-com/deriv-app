import React from 'react';

const payment_methods_list = [
    { image: 'visa',                    param: '?anchor=visa' },
    { image: 'mastercard',              param: '?anchor=mastercard' },
    { image: 'maestro',                 param: '?anchor=maestro' },
    { image: 'bank_transfer',           param: '?anchor=bank-transfer' },
    { image: 'internet_bank_transfer',  param: '?anchor=internet-bank-transfer' },
    { image: 'paysec',                  param: '?anchor=paysec',         dataShow: '-eucountry' },
    { image: 'paytrust',                param: '?anchor=paytrust',       dataShow: '-eucountry' },
    { image: 'neteller',                param: '?anchor=neteller' },
    { image: 'fasapay',                 param: '?anchor=fasapay',        dataShow: '-eucountry' },
    { image: 'perfect_money',           param: '?anchor=perfect-money',  dataShow: '-eucountry' },
    { image: 'skrill',                  param: '?anchor=skrill' },
    { image: 'qiwi',                    param: '?anchor=qiwi',           dataShow: '-eucountry' },
    { image: 'webmoney',                param: '?anchor=webmoney' },
    { image: 'yandex',                  param: '?anchor=yandex',         dataShow: '-eucountry' },
    { image: 'paysafe',                 param: '?anchor=paysafe' },
    { image: 'jeton',                   param: '?anchor=jeton',          dataShow: '-eucountry' },
    { image: 'iwallet',                 param: '?anchor=iwallet',        dataShow: '-eucountry' },
    { image: 'vload',                   param: '?anchor=vload' },
];

const PaymentLogo = () => payment_methods_list.map((item, inx) => (
    <div key={inx} className={`gr-2 gr-4-m center-text ${item.className || ''}`} data-show={item.dataShow}>
        {item.param ?
            <a
                href={`${it.url_for('cashier/payment_methods')}${item.param}`}
                rel={/^http/.test(item.href) ? 'noopener noreferrer' : undefined}
                target={item.target || undefined}
            >
                <img className='gr-12 gr-centered' src={it.url_for(`images/pages/home/payment/${item.image}.svg`)} />
            </a>
            :
            <img className='gr-12 gr-centered' src={it.url_for(`images/pages/home/payment/${item.image}.svg`)} />
        }
    </div>
));

export default PaymentLogo;
