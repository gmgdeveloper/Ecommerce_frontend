// react
import React, { useEffect, useState } from 'react';
// third-party
import { useRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';
// application
import Decor from '~/components/shared/Decor';
import VehicleSelect from '~/components/shared/VehicleSelect';
import { fetchsettingsImages } from '~/fake-server/database/brands';
import { IVehicle } from '~/interfaces/vehicle';
import { hrefToRouterArgs } from '~/services/router';
import url from '~/services/url';

function BlockFinder() {
    const router = useRouter();
    const [vehicle, setVehicle] = useState<IVehicle | null>(null);

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!vehicle) {
            return;
        }

        router.push(
            ...hrefToRouterArgs(url.products({
                filters: {
                    filter_vehicle: vehicle.id.toString(),
                },
            })),
        ).then();
    };

    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [settingimages, setImages] = useState<any>();

    useEffect(() => {
      async function fetchData() {
        try {
          const imagesData : any = await fetchsettingsImages();
          setImages(imagesData.find_part_image)
          setImagesLoaded(true);
        } catch (error) {
          console.error('Error fetching images:', error);
        }
      }
      fetchData();
    }, []);

    return (
        <div className="block block-finder">
            <Decor className="block-finder__decor" type="bottom" />
          {imagesLoaded && (
        <div
          className="block-finder__image"
          style={{ backgroundImage: `url(${settingimages})` }}
        />
      )}
            <div className="block-finder__body container container--max--xl">
                <div className="block-finder__title">
                    <FormattedMessage id="TEXT_BLOCK_FINDER_TITLE" />
                </div>
                <div className="block-finder__subtitle">
                    <FormattedMessage id="TEXT_BLOCK_FINDER_SUBTITLE" />
                </div>
                <form className="block-finder__form" onSubmit={onSubmit}>
                    <VehicleSelect className="block-finder__select" onVehicleChange={setVehicle} />

                    <button className="block-finder__button" type="submit">
                        <FormattedMessage id="BUTTON_BLOCK_FINDER_SEARCH" />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default React.memo(BlockFinder);
