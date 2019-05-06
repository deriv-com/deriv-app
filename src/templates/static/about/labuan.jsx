import React               from 'react';
import { BoxOverlayImage } from '../../_common/components/box_row.jsx';
import ImageSlider         from '../../_common/components/image_slider.jsx';

const Labuan = () =>  (
    <div className='static_full location-labuan'>
        <div className='introduction'>
            <div className='container gr-row gr-padding-20'>
                <div className='gr-12 gr-padding-20 center-text'>
                    <h1>{it.L('Labuan')}</h1>
                    <h4 className='subheader'>{it.L('The Pearl of Borneo')}</h4>
                </div>
                <div className='gr-12 gr-padding-20 gr-centered'>
                    <div className='gr-row'>
                        <div className='gr-5 gr-12-p gr-12-m'>
                            <img className='responsive' src={it.url_for('images/pages/careers/labuan/introduction-labuan.jpg')} />
                        </div>
                        <div className='gr-7 gr-12-p gr-12-m'>
                            <p className='no-margin-top'>{it.L('Labuan is a federal territory made up of the main island, Labuan Island, and six other small islands off the coast of Sabah. Its name comes from the Malay word, \'labuhan\' which means harbour. Formerly a part of the Brunei Sultanate, it was ceded to the British Crown in 1846, before joining Malaysia in 1963.')}</p>
                            <p>{it.L('Today, Labuan is known as a flourishing financial centre and tax-free tourist destination. Its economy is driven primarily by its oil and gas resources, as well as its international investment and banking services. The latter has attracted thousands of companies to Labuan over the years, plus dozens of leading banks.')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='living fill-bg-color'>
            <div className='container gr-row gr-padding-30 center-text'>
                <div className='gr-12 gr-padding-20 center-text'>
                    <h2>{it.L('Living in Labuan')}</h2>
                </div>
                <div className='gr-12'>
                    <div className='container center-text'>
                        <ImageSlider
                            images={[
                                {
                                    url    : 'images/pages/careers/labuan/island-paradise.jpg',
                                    caption: it.L('Living on an island paradise has its perks. Labuan is one of those rare gems that has yet to undergo excessive commercialisation, thus retaining its small-town charm and tight-knit community vibe. Labuan welcomes tourists throughout the year as the island enjoys good weather all year round, with average daily temperature between 28 and 32 degrees Celsius.'),
                                },
                                {
                                    url    : 'images/pages/careers/labuan/international-school.jpg',
                                    caption: it.L('Labuan has several national schools and one international school. It also has the only matriculation college in East Malaysia. Pre-university students from Sabah, Sarawak, and Labuan are required to attend this matriculation college before they continue their studies at a public university.'),
                                },
                                {
                                    url    : 'images/pages/careers/labuan/seafood.jpg',
                                    caption: it.L('As expected, the seafood is affordable and simply amazing. Locals absolutely adore crayfish which they refer to as \'satak\'. Despite being a small island, Labuan still offers so much in terms of culture; you can explore the island\'s rich history at the Labuan Museum, Peace Park, the Chimney, and Labuan Square. The island also has a vibrant nightlife.'),
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>
        <div className='misc'>
            <div className='container gr-row gr-padding-30 center-text'>
                <div className='gr-12 gr-padding-20 center-text'>
                    <h2>{it.L('Can\'t miss in Labuan')}</h2>
                </div>
                <BoxOverlayImage
                    title={it.L('Small island charm')}
                    text={it.L('Get out of the city centre and enjoy the serenity of island life free from the excesses of commercialisation. Friendly, helpful locals are also never far off.')}
                    img_src={it.url_for('images/pages/careers/labuan/small-island-charm.jpg')}
                />
                <BoxOverlayImage
                    alignment='right'
                    title={it.L('The great outdoors')}
                    text={it.L('Step outdoors and soak up the sun on one of Labuan\'s pristine beaches. There\'s also wreck diving, island hopping, kayaking, and deep sea fishing to look forward to.')}
                    img_src={it.url_for('images/pages/careers/labuan/the-great-outdoors.jpg')}
                />
            </div>
        </div>
    </div>
);

export default Labuan;
