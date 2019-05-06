import React               from 'react';
import { BoxOverlayImage } from '../../_common/components/box_row.jsx';
import ImageSlider         from '../../_common/components/image_slider.jsx';

const Cyberjaya = () =>  (
    <div className='static_full location-cyberjaya'>
        <div className='introduction'>
            <div className='container gr-row gr-padding-20'>
                <div className='gr-12 gr-padding-20 center-text'>
                    <h1>{it.L('Cyberjaya')}</h1>
                    <h4 className='subheader'>{it.L('High-tech green township')}</h4>
                </div>
                <div className='gr-12 gr-padding-20 gr-centered'>
                    <div className='gr-row'>
                        <div className='gr-5 gr-12-p gr-12-m'>
                            <img className='responsive' src={it.url_for('images/pages/careers/cyberjaya/introduction-cyberjaya.jpg')} />
                        </div>
                        <div className='gr-7 gr-12-p gr-12-m'>
                            <p className='no-margin-top'>{it.L('Cyberjaya is a pioneer tech hub that lies 30 minutes away from Kuala Lumpur. Established in 1997, Cyberjaya is the heartbeat of the Multimedia Super Corridor — a government-designated zone that aims to accelerate Malaysia\'s push to achieve Vision 2020.')}</p>
                            <p>{it.L('Cyberjaya is also a pioneer green township that is designed for sustainable living. It has an urban environment where almost half of its total development area is reserved for public amenities and greenery. It has also taken measures to cut carbon emissions based on a low carbon city framework, becoming a model for sustainable future cities.')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='living fill-bg-color'>
            <div className='container gr-row gr-padding-30 center-text'>
                <div className='gr-12 gr-padding-20 center-text'>
                    <h2>{it.L('Living in Cyberjaya')}</h2>
                </div>
                <div className='gr-12'>
                    <div className='container center-text'>
                        <ImageSlider
                            images={[
                                {
                                    url    : 'images/pages/careers/cyberjaya/companies.jpg',
                                    caption: it.L('As a high-tech knowledge hub, Cyberjaya enjoys the presence of several multinational companies and private universities. This has created a vibrant, thriving community thanks to the many expats and international students who call Cyberjaya home.'),
                                },
                                {
                                    url    : 'images/pages/careers/cyberjaya/food.jpg',
                                    caption: it.L('If you call yourself a foodie, you\'ll be blown away by the sheer number of choices in town. From Middle Eastern, Indian, Japanese, and international cuisine to essential local fare such as Malay, Chinese, and mamak — you can expect to satisfy any cravings you may have.'),
                                },
                                {
                                    url    : 'images/pages/careers/cyberjaya/lower-cost-living.jpg',
                                    caption: it.L('Malaysia\'s lower cost of living compared to most western countries means that you can enjoy a high quality of life. You\'ll also find easy access to world-class healthcare, plus several international schools, colleges, and universities that offer globally-recognised programmes.'),
                                },
                            ]}
                        />
                    </div>
                    <div className='gr-4 gr-6-p padding-20-m gr-8-m box-container gr-centered'>
                        <div className='box bordered'>
                            <a href={it.url_for('download/binary-expat-handbook.pdf')} target='_blank' rel='noopener noreferrer'>
                                <div className='items'>
                                    <div>
                                        <img src={it.url_for('/images/pages/careers/ex-icon.svg')} />
                                    </div>
                                    <div className='box-item-end'>
                                        <p className='center-text'>{it.L('Expat handbook')}</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='misc'>
            <div className='container gr-row gr-padding-30 center-text'>
                <div className='gr-12 gr-padding-20 center-text'>
                    <h2>{it.L('Can\'t miss in Cyberjaya')}</h2>
                </div>
                <BoxOverlayImage
                    title={it.L('Lush living')}
                    text={it.L('Cyberjaya expertly combines green lungs and modern amenities to give you the ultimate work-life balance.')}
                    img_src={it.url_for('images/pages/careers/cyberjaya/lush-living.jpg')}
                />
                <BoxOverlayImage
                    alignment='right'
                    title={it.L('Cultural diversity')}
                    text={it.L('Expats and international students make up more than 10% of Cyberjaya\'s vibrant population.')}
                    img_src={it.url_for('images/pages/careers/cyberjaya/cultural-diversity.jpg')}
                />
                <BoxOverlayImage
                    title={it.L('Putrajaya')}
                    text={it.L('Located 10 minutes away, Malaysia\'s intelligent garden city offers stunning greenery and exquisite structures.')}
                    img_src={it.url_for('images/pages/careers/cyberjaya/putrajaya.jpg')}
                />
            </div>
        </div>
    </div>
);

export default Cyberjaya;
