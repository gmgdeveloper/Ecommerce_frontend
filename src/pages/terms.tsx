// react
import React, { useEffect, useState } from 'react';
// application
import BlockSpace from '~/components/blocks/BlockSpace';
import PageTitle from '~/components/shared/PageTitle';
import { ITermResults } from '~/interfaces/termsandcondtions';

function Page() {

    const [data,setData]=useState<ITermResults>();
 

    useEffect(() => {
        const fetchAllPages = async () => {
          try {
            const response = await fetch('https://azantest.gmgsolution.com/api/allPage');
            const fetchedData = await response.json();
            if (fetchedData && fetchedData.termsResults) {
              setData({ data: fetchedData.termsResults }); // Set the state properly
          } 
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchAllPages();
      }, []);
    return (
        <React.Fragment>
            <PageTitle>
                {data && data.data.length > 0 && (
    data.data[0].name
)}
            </PageTitle>

            <BlockSpace layout="spaceship-ledge-height" />

            <div className="block">
                <div className="container">
                    <div className="document">
                        <div className="document__header">
                            <h1 className="document__title">
                            
                            {data && data.data.length > 0 && (
    data.data[0].name
)}
                            </h1>
                            <div className="document__subtitle">This Agreement was last modified on 27 May 2018.</div>
                        </div>
                        <div className="document__content card">
                         {data && data.data.length > 0 && (
    <div  dangerouslySetInnerHTML={{ __html: data.data[0].content }} />
)}

                            {/* <div className="typography">
                                <Terms />

                                <div className="document__signature">
                                    <AppImage src="/images/signature.jpg" width="160" height="55" />
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

export default Page;
