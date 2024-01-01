// react
import React, { useEffect, useState } from 'react';
// application
import BlockReviews from '~/components/blocks/BlockReviews';
import BlockSpace from '~/components/blocks/BlockSpace';
import BlockTeammates from '~/components/blocks/BlockTeammates';
import AppImage from '~/components/shared/AppImage';
import Decor from '~/components/shared/Decor';
import PageTitle from '~/components/shared/PageTitle';
import { IAboutUs } from '~/interfaces/aboutus';
import { baseUrl } from '~/services/utils';

function Page() {
    const [data, setData] = useState<IAboutUs | undefined>(); // Initialize as undefined

    useEffect(() => {
        const fetchAllPages = async () => {
            try {
                const response = await fetch('https://azantest.gmgsolution.com/api/allPage');
                const fetchedData = await response.json();
                
                // Check if aboutResults exists in fetchedData before setting the state
                if (fetchedData && fetchedData.aboutResults) {
                    setData({ data: fetchedData.aboutResults }); // Set the state properly
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchAllPages();
    }, []);
    //  async function fetchAllPages(){
    //     try {
    //         const response = await fetch('https://azantest.gmgsolution.com/api/allPage');
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch data');
    //         }
    //         const data = await response.json();
    //         setData(data.aboutResults)
    //         console.log('Error fetching data:',data.aboutResults);


    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //         return [];
    //     }
    // }
    return (
        <React.Fragment>
            <PageTitle>
            {data && data.data.length > 0 && (
    data.data[0].name
)}

            </PageTitle>

            <div className="about">
                <div className="about__body">
                    <div className="about__image">
                        <div
                            className="about__image-bg"
                            style={{
                                backgroundImage: `url(${baseUrl('/images/about.jpg')})`,
                            }}
                        />
                        <Decor className="about__image-decor" type="bottom" />
                    </div>

                    <div className="about__card">
                        <div className="about__card-title">{ }</div>
                            {/* {aboutUsContext[0].content} */}
                            {/* {data.length > 0 && (
                        )} */}
                        {data && data.data.length > 0 && (
    <div className="about__card-text" dangerouslySetInnerHTML={{ __html: data.data[0].content }} />
)}


                        <div className="about__card-author">Ryan Ford, CEO RedParts</div>
                        <div className="about__card-signature">
                            <AppImage src="/images/signature.jpg" width="160" height="55" />
                        </div>
                    </div>

                    <div className="about__indicators">
                        <div className="about__indicators-body">
                            <div className="about__indicators-item">
                                <div className="about__indicators-item-value">350</div>
                                <div className="about__indicators-item-title">Stores around the world</div>
                            </div>
                            <div className="about__indicators-item">
                                <div className="about__indicators-item-value">80 000</div>
                                <div className="about__indicators-item-title">Original auto parts</div>
                            </div>
                            <div className="about__indicators-item">
                                <div className="about__indicators-item-value">5 000</div>
                                <div className="about__indicators-item-title">Satisfied customers</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BlockSpace layout="divider-xl" />

            <BlockTeammates />

            <BlockSpace layout="divider-xl" />

            <BlockReviews />

            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

export default Page;
