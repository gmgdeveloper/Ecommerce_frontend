// react
import React, { useEffect, useState } from 'react';
// application
import BlockHeader from '~/components/blocks/BlockHeader';
import BlockMap from '~/components/blocks/BlockMap';
import BlockSpace from '~/components/blocks/BlockSpace';
import PageTitle from '~/components/shared/PageTitle';
// data
import { IContactus } from '~/interfaces/contact';

function Page() {
    const [data, setData] = useState<IContactus>();


    useEffect(() => {
        const fetchAllPages = async () => {
            try {
                const response = await fetch('https://azantest.gmgsolution.com/api/allPage');
                const fetchedData = await response.json();
                if (fetchedData && fetchedData.contactResults) {
                    setData({ data: fetchedData.contactResults }); // Set the state properly
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchAllPages();
    }, []);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch('https://azantest.gmgsolution.com/api/contact-us', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Handle success
                console.log('Message sent successfully!');
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: '',
                });
            } else {
                // Handle error
                console.error('Failed to send message.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <React.Fragment>
            <PageTitle>
                    {data && data.data.length > 0 && (
    data.data[0].name
)}

            </PageTitle>

            <BlockMap />

            <BlockHeader
                pageTitle="Contact Us"
                breadcrumb={[
                    { title: 'Home', url: '' },
                    { title: 'Breadcrumb', url: '' },
                    { title: 'Current Page', url: '' },
                ]}
                afterHeader={false}
            />

            <div className="block">
                <div className="container container--max--lg">
                    <div className="card">
                        <div className="card-body card-body--padding--2">
                            <div className="row">
                                <div className="col-12 col-lg-6 pb-4 pb-lg-0">
                                    <div className="mr-1">
                                        <h4 className="contact-us__header card-title">                  {data && data.data.length > 0 && (
    data.data[0].name
)}</h4>

                                        <div className="contact-us__address">

                                                       {data && data.data.length > 0 && (
    <div  dangerouslySetInnerHTML={{ __html: data.data[0].content }} />
)}


                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-lg-6">
                                    <div className="ml-1">
                                        <h4 className="contact-us__header card-title">Leave us a Message</h4>

                                        <form onSubmit={handleSubmit}>
                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="name">Your Name</label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        className="form-control"
                                                        placeholder="Your Name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="email">Email</label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        className="form-control"
                                                        placeholder="Email Address"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="subject">Subject</label>
                                                <input
                                                    type="text"
                                                    id="subject"
                                                    className="form-control"
                                                    placeholder="Subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="message">Message</label>
                                                <textarea
                                                    id="message"
                                                    className="form-control"
                                                    rows={4}
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <button type="submit" className="btn btn-primary">
                                                Send Message
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

export default Page;
