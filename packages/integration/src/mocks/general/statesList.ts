import { Context } from '../../utils/mocks/mocks';

export default function mockStatesList(context: Context) {
    if ('states_list' in context.request) {
        context.response = {
            echo_req: {
                req_id: context.req_id,
                states_list: 'th',
            },
            msg_type: 'states_list',
            req_id: context.req_id,
            states_list: [
                {
                    text: 'Amnat Charoen',
                    value: '37',
                },
                {
                    text: 'Ang Thong',
                    value: '15',
                },
                {
                    text: 'Buri Ram',
                    value: '31',
                },
                {
                    text: 'Chachoengsao',
                    value: '24',
                },
                {
                    text: 'Chai Nat',
                    value: '18',
                },
                {
                    text: 'Chaiyaphum',
                    value: '36',
                },
                {
                    text: 'Chanthaburi',
                    value: '22',
                },
                {
                    text: 'Chiang Mai',
                    value: '50',
                },
                {
                    text: 'Chiang Rai',
                    value: '57',
                },
                {
                    text: 'Chon Buri',
                    value: '20',
                },
                {
                    text: 'Chumphon',
                    value: '86',
                },
                {
                    text: 'Kalasin',
                    value: '46',
                },
                {
                    text: 'Kamphaeng Phet',
                    value: '62',
                },
                {
                    text: 'Kanchanaburi',
                    value: '71',
                },
                {
                    text: 'Khon Kaen',
                    value: '40',
                },
                {
                    text: 'Krabi',
                    value: '81',
                },
                {
                    text: 'Krung Thep Maha Nakhon Bangkok',
                    value: '10',
                },
                {
                    text: 'Lampang',
                    value: '52',
                },
                {
                    text: 'Lamphun',
                    value: '51',
                },
                {
                    text: 'Loei',
                    value: '42',
                },
                {
                    text: 'Lop Buri',
                    value: '16',
                },
                {
                    text: 'Mae Hong Son',
                    value: '58',
                },
                {
                    text: 'Maha Sarakham',
                    value: '44',
                },
                {
                    text: 'Mukdahan',
                    value: '49',
                },
                {
                    text: 'Nakhon Nayok',
                    value: '26',
                },
                {
                    text: 'Nakhon Pathom',
                    value: '73',
                },
                {
                    text: 'Nakhon Phanom',
                    value: '48',
                },
                {
                    text: 'Nakhon Ratchasima',
                    value: '30',
                },
                {
                    text: 'Nakhon Sawan',
                    value: '60',
                },
                {
                    text: 'Nakhon Si Thammarat',
                    value: '80',
                },
                {
                    text: 'Nan',
                    value: '55',
                },
                {
                    text: 'Narathiwat',
                    value: '96',
                },
                {
                    text: 'Nong Bua Lam Phu',
                    value: '39',
                },
                {
                    text: 'Nong Khai',
                    value: '43',
                },
                {
                    text: 'Nonthaburi',
                    value: '12',
                },
                {
                    text: 'Pathum Thani',
                    value: '13',
                },
                {
                    text: 'Pattani',
                    value: '94',
                },
                {
                    text: 'Phangnga',
                    value: '82',
                },
                {
                    text: 'Phatthalung',
                    value: '93',
                },
                {
                    text: 'Phatthaya',
                    value: 'S',
                },
                {
                    text: 'Phayao',
                    value: '56',
                },
                {
                    text: 'Phetchabun',
                    value: '67',
                },
                {
                    text: 'Phetchaburi',
                    value: '76',
                },
                {
                    text: 'Phichit',
                    value: '66',
                },
                {
                    text: 'Phitsanulok',
                    value: '65',
                },
                {
                    text: 'Phra Nakhon Si Ayutthaya',
                    value: '14',
                },
                {
                    text: 'Phrae',
                    value: '54',
                },
                {
                    text: 'Phuket',
                    value: '83',
                },
                {
                    text: 'Prachin Buri',
                    value: '25',
                },
                {
                    text: 'Prachuap Khiri Khan',
                    value: '77',
                },
                {
                    text: 'Ranong',
                    value: '85',
                },
                {
                    text: 'Ratchaburi',
                    value: '70',
                },
                {
                    text: 'Rayong',
                    value: '21',
                },
                {
                    text: 'Roi Et',
                    value: '45',
                },
                {
                    text: 'Sa Kaeo',
                    value: '27',
                },
                {
                    text: 'Sakon Nakhon',
                    value: '47',
                },
                {
                    text: 'Samut Prakan',
                    value: '11',
                },
                {
                    text: 'Samut Sakhon',
                    value: '74',
                },
                {
                    text: 'Samut Songkhram',
                    value: '75',
                },
                {
                    text: 'Saraburi',
                    value: '19',
                },
                {
                    text: 'Satun',
                    value: '91',
                },
                {
                    text: 'Si Sa Ket',
                    value: '33',
                },
                {
                    text: 'Sing Buri',
                    value: '17',
                },
                {
                    text: 'Songkhla',
                    value: '90',
                },
                {
                    text: 'Sukhothai',
                    value: '64',
                },
                {
                    text: 'Suphan Buri',
                    value: '72',
                },
                {
                    text: 'Surat Thani',
                    value: '84',
                },
                {
                    text: 'Surin',
                    value: '32',
                },
                {
                    text: 'Tak',
                    value: '63',
                },
                {
                    text: 'Trang',
                    value: '92',
                },
                {
                    text: 'Trat',
                    value: '23',
                },
                {
                    text: 'Ubon Ratchathani',
                    value: '34',
                },
                {
                    text: 'Udon Thani',
                    value: '41',
                },
                {
                    text: 'Uthai Thani',
                    value: '61',
                },
                {
                    text: 'Uttaradit',
                    value: '53',
                },
                {
                    text: 'Yala',
                    value: '95',
                },
                {
                    text: 'Yasothon',
                    value: '35',
                },
            ],
        };
    }
}
