// react
import React, { useEffect, useState } from 'react';
// third-party
import { FormattedMessage, useIntl } from 'react-intl';
// application
import AppImage from '~/components/shared/AppImage';
import AppLink from '~/components/shared/AppLink';
import { fetchsettingsImages } from '~/fake-server/database/brands';

function BlockBanners() {
    const intl = useIntl();
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [banImage1, setBanImage1] = useState<any>();
    const [banImage2, setBanImage2] = useState<any>();

    useEffect(() => {
      async function fetchData() {
        try {
          const imagesData : any = await fetchsettingsImages();
          setBanImage1(imagesData.motor_image)
          setBanImage2(imagesData.save_image)
          setImagesLoaded(true);
        } catch (error) {
          console.error('Error fetching images:', error);
        }
      }
      fetchData();
    }, []);
    return (
        <div className="block block-banners">
            <div className="container">
                <div className="block-banners__list">
                    <AppLink href="/" className="block-banners__item block-banners__item--style--one">
                        <span className="block-banners__item-image">
                            <AppImage className="reflect-rtl" src={banImage1} />
                        </span>
                        <span className="block-banners__item-image block-banners__item-image--blur">
                            <AppImage className="reflect-rtl" src={banImage1} />
                        </span>
                        <span className="block-banners__item-title">
                            <FormattedMessage id="TEXT_BANNER_ONE_TITLE" />
                        </span>
                        <span
                            className="block-banners__item-details"
                            dangerouslySetInnerHTML={{
                                __html: intl.formatMessage({ id: 'TEXT_BANNER_ONE_SUBTITLE' }),
                            }}
                        />
                        <span className="block-banners__item-button btn btn-primary btn-sm">
                            <FormattedMessage id="TEXT_BANNER_ONE_BUTTON" />
                        </span>
                    </AppLink>

                    <AppLink href="/" className="block-banners__item block-banners__item--style--two">
                        <span className="block-banners__item-image">
                            <AppImage className="reflect-rtl" src={banImage2} />
                        </span>
                        <span className="block-banners__item-image block-banners__item-image--blur">
                            <AppImage className="reflect-rtl" src={banImage2} />
                        </span>
                        <span className="block-banners__item-title">
                            <FormattedMessage id="TEXT_BANNER_TWO_TITLE" />
                        </span>
                        <span
                            className="block-banners__item-details"
                            dangerouslySetInnerHTML={{
                                __html: intl.formatMessage({ id: 'TEXT_BANNER_TWO_SUBTITLE' }),
                            }}
                        />
                        <span className="block-banners__item-button btn btn-primary btn-sm">
                            <FormattedMessage id="TEXT_BANNER_TWO_BUTTON" />
                        </span>
                    </AppLink>
                </div>
            </div>
        </div>
    );
}

export default React.memo(BlockBanners);
