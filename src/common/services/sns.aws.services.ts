import { SNSClient, PublishCommand, SubscribeCommand, ListSubscriptionsByTopicCommand, UnsubscribeCommand } from '@aws-sdk/client-sns';

const snsClient = new SNSClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
        secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
    },
});

const SNS_NEW_PRODUCTS_ARN = process.env['SNS_NEW_PRODUCTS_TOPIC'];

const getEmailSubscriptionAttributes = async (emailAddress: string) => {
    const response = await snsClient.send(
        new ListSubscriptionsByTopicCommand({
            TopicArn: SNS_NEW_PRODUCTS_ARN,
        }),
    );
    const filteredResonse = response.Subscriptions?.filter(
        (subscription) => subscription.Endpoint === emailAddress,
    );
    if (
        filteredResonse &&
        filteredResonse.length > 0 &&
        filteredResonse[0].Endpoint === emailAddress
    )
        return filteredResonse;
    else return null;
};

export const publishNewProduct = async (
    message: string = 'Hello from SNS!',
    topicArn = SNS_NEW_PRODUCTS_ARN,
) => {
    try {
        const response = await snsClient.send(
            new PublishCommand({
                Message: message,
                TopicArn: topicArn,
            }),
        );
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const subscribeEmailToTopic = async (emailAddress: string) => {
    try {
        const response = await snsClient.send(
            new SubscribeCommand({
                Protocol: "email",
                TopicArn: SNS_NEW_PRODUCTS_ARN,
                Endpoint: emailAddress,
            }),
        );
        return response;    
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const checkEmailSubscriptionStatus = async (emailAddress: string) => {
    try {
        const response = await snsClient.send(new ListSubscriptionsByTopicCommand({
            TopicArn: SNS_NEW_PRODUCTS_ARN,
        }));

        const filteredResonse = response.Subscriptions?.filter(subscription => subscription.Endpoint === emailAddress);        
        if (
            filteredResonse &&
            filteredResonse.length > 0 &&
            filteredResonse[0].Endpoint === emailAddress
        ) {
            return filteredResonse[0].SubscriptionArn === 'PendingConfirmation' ? 'pending' : true;
        }
        else return false;

    } catch (error) {
        console.error(error);
        return error;
    }
};

export const unsubscribeEmailSubscription = async (emaiAddress: string) => {
    try {
        const subAttributes = await getEmailSubscriptionAttributes(emaiAddress);
        if (subAttributes) {
            const response = await snsClient.send(new UnsubscribeCommand({
                SubscriptionArn: subAttributes[0].SubscriptionArn,            
            }));            
            return response;
        } else return null;
    } catch (error) {
        console.error(error);
        return false;
    }
};
