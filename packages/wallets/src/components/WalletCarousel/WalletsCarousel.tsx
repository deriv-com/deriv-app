import React, { useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AccountsList from '../AccountsList';

const WalletsCarousel = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ skipSnaps: true, containScroll: false });
    const data = [
        {
            text: 'BTC',
            background: 'yellow',
        },
        {
            text: 'ETH',
            background: 'blue',
        },
        {
            text: 'USDT',
            background: 'red',
        },
    ];

    const [active_index, setActiveIndex] = useState(0);

    React.useEffect(() => {
        emblaApi?.scrollTo(active_index);
    }, [active_index, emblaApi]);

    React.useEffect(() => {
        emblaApi?.on('select', () => {
            const scroll_snap_index = emblaApi.selectedScrollSnap();
            setActiveIndex(scroll_snap_index);
        });
    }, [emblaApi]);

    return (
        <React.Fragment>
            <div className='wallets-carousel' ref={emblaRef}>
                <section className='wallets-carousel__container'>
                    {data.map(item => (
                        <div className='wallet-card' style={{ backgroundColor: item.background }} key={item.text}>
                            {item.text}
                        </div>
                    ))}
                </section>
            </div>
            <AccountsList data={data[active_index]} />
        </React.Fragment>
    );
};

export default WalletsCarousel;
