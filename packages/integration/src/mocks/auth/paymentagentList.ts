import { Context } from '../../utils/mocks/mocks';

export default function mockPaymentagentList(context: Context) {
    if (
        'paymentagent_list' in context.request &&
        context.request.paymentagent_list === 'th' &&
        context.request.currency === 'USD'
    ) {
        context.response = {
            echo_req: {
                currency: 'USD',
                paymentagent_list: 'th',
                req_id: context.req_id,
            },
            msg_type: 'paymentagent_list',
            paymentagent_list: {
                available_countries: [
                    ['af', 'Afghanistan'],
                    ['ao', 'Angola'],
                    ['ar', 'Argentina'],
                    ['au', 'Australia'],
                    ['bd', 'Bangladesh'],
                    ['bf', 'Burkina Faso'],
                    ['bi', 'Burundi'],
                    ['bj', 'Benin'],
                    ['bo', 'Bolivia'],
                    ['br', 'Brazil'],
                    ['bw', 'Botswana'],
                    ['cd', 'Congo - Kinshasa'],
                    ['cg', 'Congo - Brazzaville'],
                    ['ci', "Cote d'Ivoire"],
                    ['cl', 'Chile'],
                    ['cm', 'Cameroon'],
                    ['cn', 'China'],
                    ['co', 'Colombia'],
                    ['cu', 'Cuba'],
                    ['dj', 'Djibouti'],
                    ['do', 'Dominican Republic'],
                    ['dz', 'Algeria'],
                    ['ec', 'Ecuador'],
                    ['eg', 'Egypt'],
                    ['et', 'Ethiopia'],
                    ['ga', 'Gabon'],
                    ['ge', 'Georgia'],
                    ['gh', 'Ghana'],
                    ['gn', 'Guinea'],
                    ['gw', 'Guinea-Bissau'],
                    ['id', 'Indonesia'],
                    ['in', 'India'],
                    ['jp', 'Japan'],
                    ['ke', 'Kenya'],
                    ['kh', 'Cambodia'],
                    ['kr', 'South Korea'],
                    ['kw', 'Kuwait'],
                    ['la', 'Laos'],
                    ['lb', 'Lebanon'],
                    ['lk', 'Sri Lanka'],
                    ['ls', 'Lesotho'],
                    ['ly', 'Libya'],
                    ['ma', 'Morocco'],
                    ['mg', 'Madagascar'],
                    ['ml', 'Mali'],
                    ['mn', 'Mongolia'],
                    ['mv', 'Maldives'],
                    ['mw', 'Malawi'],
                    ['mz', 'Mozambique'],
                    ['na', 'Namibia'],
                    ['ne', 'Niger'],
                    ['ng', 'Nigeria'],
                    ['om', 'Oman'],
                    ['pe', 'Peru'],
                    ['ph', 'Philippines'],
                    ['pk', 'Pakistan'],
                    ['qa', 'Qatar'],
                    ['ru', 'Russia'],
                    ['sa', 'Saudi Arabia'],
                    ['sd', 'Sudan'],
                    ['sl', 'Sierra Leone'],
                    ['sn', 'Senegal'],
                    ['so', 'Somalia'],
                    ['ss', 'South Sudan'],
                    ['sz', 'Swaziland'],
                    ['tg', 'Togo'],
                    ['th', 'Thailand'],
                    ['tr', 'Turkey'],
                    ['tz', 'Tanzania'],
                    ['ug', 'Uganda'],
                    ['uy', 'Uruguay'],
                    ['vn', 'Vietnam'],
                    ['ws', 'Samoa'],
                    ['za', 'South Africa'],
                    ['zm', 'Zambia'],
                    ['zw', 'Zimbabwe'],
                ],
                list: [
                    {
                        currencies: 'USD',
                        deposit_commission: '0',
                        email: 'teclasarojani@gmail.com',
                        further_information:
                            'ආයුබෝවන් ඔබට අවශ්‍ය Binary / Deriv $ මිලට ගැනීමට අප සමග සමිබන්ධ වෙන්න. Bank Transfer( cash ), USDT Exchange , E-wallet Exchange සමග ඉතා කඩිනම් සුහදශීලී හා ලාබදායි ලෙස ඔබට අපගෙන් ලබාගත හැක. Binary/ Deriv Dollars,USDT, Crypto மாற்றம் அல்லது வாங்குதல் மற்றும் விற்பனை நோக்கங்களுக்காக என்னை தொடர்பு கொள்ளவும். குறைந்த விகிதங்கள் மற்றும் வேகமான சேவைகள் எங்களிடம் பெற்றுக்கொள்ளலாம். You are warmly welcome to my premium payment agent group. Whatsapp following Number for more details.',
                        max_withdrawal: '2000',
                        min_withdrawal: '10',
                        name: 'Chamara Madusanka Dharmasena',
                        paymentagent_loginid: 'CR2154875',
                        phone_numbers: [
                            {
                                phone_number: '+94761540855',
                            },
                        ],
                        summary: '',
                        supported_payment_methods: [
                            {
                                payment_method: 'Bank transfer',
                            },
                            {
                                payment_method: 'Boc Peoples Bank',
                            },
                            {
                                payment_method: 'BTC',
                            },
                            {
                                payment_method: 'Crypto Payment',
                            },
                            {
                                payment_method: 'E-wallets',
                            },
                            {
                                payment_method: 'HNB',
                            },
                            {
                                payment_method: 'LOLC',
                            },
                            {
                                payment_method: 'Sampath Bank',
                            },
                            {
                                payment_method: 'USDT',
                            },
                        ],
                        urls: [
                            {
                                url: 'https://t.me/+b8-HyBzP09U3NDhl',
                            },
                            {
                                url: 'https://www.facebook.com/m8az2z?mibextid=LQQJ4d',
                            },
                        ],
                        withdrawal_commission: '0',
                    },
                ],
            },
            req_id: context.req_id,
        };
    }
}
