// react
import React, { useEffect, useState } from 'react';
// application
import BlockSpace from '~/components/blocks/BlockSpace';
import AppLink from '~/components/shared/AppLink';
import PageTitle from '~/components/shared/PageTitle';
import { IFaqs } from '~/interfaces/faq';
import url from '~/services/url';

function Page() {

    const [data, setData] = useState<IFaqs>();


    useEffect(() => {
        const fetchAllPages = async () => {
            try {
                const response = await fetch('https://azantest.gmgsolution.com/api/faq');
                const fetchedData = await response.json();
                setData(fetchedData.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchAllPages();
    }, []);

    return (
        <React.Fragment>
            <PageTitle>Frequently Asked Questions</PageTitle>

            <BlockSpace layout="spaceship-ledge-height" />

            <div className="block faq">
                <div className="container container--max--xl">
                    <div className="faq__header">
                        <h1 className="faq__header-title">Frequently Asked Questions</h1>
                    </div>

                    <div className="faq__section">
                        <h3 className="faq__section-title">Faqs</h3>
                        <div className="faq__section-body">

                        {Array.isArray(data) && data.map((faq, i) => (
    <div className="faq__question" key={i}>
        <h5 className="faq__question-title">{faq.question}</h5>
        <div className="faq__question-answer">
            <div className="typography">
                <p>{faq.answer}</p>
            </div>
        </div>
    </div>
))}




                        </div>
                    </div>



                    <div className="faq__footer">
                        <div className="faq__footer-title">Still Have A Questions?</div>
                        <div className="faq__footer-subtitle">
                            We will be happy to answer any questions you may have.
                        </div>
                        <AppLink href={url.pageContactUs()} className="btn btn-primary">
                            Contact Us
                        </AppLink>
                    </div>
                </div>
            </div>

            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

export default Page;
