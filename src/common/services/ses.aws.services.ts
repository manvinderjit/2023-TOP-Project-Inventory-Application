import {
    CreateEmailIdentityCommand,
    GetEmailIdentityCommand,
    SendEmailCommand,
    SESv2Client,
} from '@aws-sdk/client-sesv2';

const sesClientV2 = new SESv2Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
        secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
    },
});

const generateOrderTableForEmail = (orderDetails: any) => {    
    let htmlText = '';
    htmlText += '<table>';
    htmlText += '<tr><th>Name</th><th>Description</th><th>Qty</th><th>Price</th></tr>';
    orderDetails.items.map((item: { itemDetails: { name: any; description: any; }; itemQuantity: any; itemPrice: any; }) => {
        htmlText += '<tr>';
        htmlText += `<td>${item.itemDetails.name}</td>`;
        htmlText += `<td>${item.itemDetails.description}</td>`;
        htmlText += `<td>${item.itemQuantity}</td>`;
        htmlText += `<td>${item.itemPrice}</td>`;
        htmlText += '</tr>';
    });
    htmlText += '<table>';
    return htmlText;
};

const generateHtmlPageContent = async (orderDetails: any) => {
    const table = generateOrderTableForEmail(orderDetails);
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Orders</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;                    
                }
                table, th, td {
                    border: 1px solid gray;
                }
                td {
                    padding: 1px;
                }
                .email-wrapper {
                    width: 100%;
                    background-color: #f4f4f4;
                    padding: 20px;
                    text-align: center;
                }
                .email-content {
                    width: 100%;
                    max-width: 600px;
                    background-color: #ffffff;
                    margin: 0 auto;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                    background-color: #4CAF50;
                    color: #ffffff;
                    padding: 16px;
                    font-size: 22px;
                    font-weight: bold;
                    text-align: center;
                    border-radius: 8px 8px 0 0;
                }
                .email-body {
                    font-size: 16px;
                    color: #333;
                    line-height: 1.6;                    
                    margin: 15px 2px 15px 2px;
                }                
                .footer {
                    font-size: 12px;
                    color: #999;
                    text-align: center;
                    margin-top: 10px;
                }
            </style>
        </head>
        <body>
            <div class="email-wrapper">
                <div class="email-content">
                    <!-- Email Header -->
                    <div class="email-header">
                        Thank you for your order!
                    </div>
                    <!-- Email Body -->
                    <div class="email-body">
                        ${table}
                    </div>
                    <!-- Footer -->
                    <div class="footer">
                        <p>This is only for a portfolio demonstration. It is not a live project!</p>
                        <p>[https://2023-top-project-shopping-cart.pages.dev]</p>
                    </div>
                </div>
            </div>
        </body>
        </html>`;
};

const emailContent = async (contentType: 'Login' | 'Checkout', htmlContent: string): Promise<{ subject: string, body: { text: string, html: string }}> => {
    
    switch (contentType) {
        case 'Login': {
            return {
                subject: 'Login Success at shopping app!',
                body: {
                    text: 'You have logged in to your account at shopping app!',
                    html: 'You have logged in to your account at shopping app!',
                },
            };            
        } case 'Checkout': {
            return {
                subject: 'Order Successfully Placed at Shopping App!',
                body: {
                    text: 'You have successfully placed the following order at the shopping app!',
                    html: htmlContent,
                },
            };
        } default : {
            return {
                subject: '',
                body: { text: '', html: ''},
            };
        }
    }
};

const createSendEmailCommand = (toAddress: string, fromAddress: string, dataSubject: string, dataBody: { text: string, html: string }) => {
    return new SendEmailCommand({
        FromEmailAddress: fromAddress,
        Destination: {
            // Destination
            ToAddresses: [
                // EmailAddressList
                toAddress,
            ],
        },
        Content: {
            // EmailContent
            Simple: {
                // Message
                Subject: {
                    // Content
                    Data: dataSubject,
                    Charset: 'UTF-8',
                },
                Body: {
                    // Body
                    Text: {
                        Data: dataBody.text,
                        Charset: 'UTF-8',
                    },
                    Html: {
                        Data: dataBody.html,
                        Charset: 'UTF-8',
                    },
                },
            },
        },
    });
};

const getEmailIdentity = async (emailAddress: string) => {
    const command = new GetEmailIdentityCommand({ EmailIdentity: emailAddress });
    return await sesClientV2.send(command);
};

const createVerifyEmailIdentityCommand = (emailAddress: string) => {
    return new CreateEmailIdentityCommand({ EmailIdentity: emailAddress })
};

export const checkEmailExistsAndVerified = async (emailAddress: string) => {
    try {
        const results = await getEmailIdentity(emailAddress);        
        // If email identity exists
        if (results.$metadata.httpStatusCode === 200) {
            return results.VerificationStatus === 'SUCCESS' ? true : false; // Is verified true | false
        } else return null; // Identity doesn't exists, won't trigger due to the return object design but added as fail-safe for the future
    } catch (error: any) {        
        if(error?.$metadata?.httpStatusCode === 404) {
            return null; // Identity doesn't exists
        } else return error;
    }
};

export const verifyEmail = async (emailAddress: string) => {
    const verifyEmailIdentityCommand =
        createVerifyEmailIdentityCommand(emailAddress);
    try {        
        return await sesClientV2.send(verifyEmailIdentityCommand);
    } catch (err) {
        console.log('Failed to verify email identity.', err);
        return err;
    }
};

export const sendEmailv2 = async (toAddress: string, contentType: 'Login' | 'Checkout', orderDetails: any | undefined) => {    
    const emailContents = await emailContent(contentType, orderDetails ? await generateHtmlPageContent(orderDetails) : '');
    const sendEmailCommand = createSendEmailCommand(
        toAddress,
        'noreply@ia.manvinderjit.com',
        emailContents.subject,
        emailContents.body
    );

    try {
        const response = await sesClientV2.send(sendEmailCommand);
    } catch (caught) {
        if (caught instanceof Error && caught.name === 'MessageRejected') {
            /** @type { import('@aws-sdk/client-ses').MessageRejected} */
            const messageRejectedError = caught;
            return messageRejectedError;
        }
        console.log(caught);
        throw caught;
    }
};

