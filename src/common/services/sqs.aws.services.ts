import { DeleteMessageCommand, QueueAttributeName, ReceiveMessageCommand, SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Types } from 'mongoose';

const client = new SQSClient({});
const SQS_QUEUE_URL_CHECKOUT = process.env['SQS_QUEUE_URL_CHECKOUT'];

export const sendOrderToSQSQueue = async (
    messageBody: {
        customerId: string;
        items: {
            itemQuantity: number;
            itemId: Types.ObjectId;
            itemPrice: number;
        }[];
        totalAmount: any;
    },
) => {
    const command = new SendMessageCommand({
        QueueUrl: SQS_QUEUE_URL_CHECKOUT,
        DelaySeconds: 10,
        MessageAttributes: {
            CustomerId: {
                DataType: 'String',
                StringValue: messageBody.customerId,
            },            
        },
        MessageBody: JSON.stringify(messageBody),
    });

    const response = await client.send(command);
    return response;
};

 const receiveMessage = (queueUrl: string | undefined) =>
    client.send(
        new ReceiveMessageCommand({
            AttributeNames: ['SentTimestamp'] as unknown as QueueAttributeName[],
            MaxNumberOfMessages: 10,
            MessageAttributeNames: ['All'],
            QueueUrl: queueUrl,
            WaitTimeSeconds: 20,
            VisibilityTimeout: 30,
        }),
     );

export const deleteMessageFromSQSQueue = async (receiptHandle: string) => {
    const result = await client.send(
        new DeleteMessageCommand({
            QueueUrl: SQS_QUEUE_URL_CHECKOUT,
            ReceiptHandle: receiptHandle,
        }),
    );
};

export const fetchOrdersFromSQSQueue = async (customerId: string) => {

    const { Messages } = await receiveMessage(SQS_QUEUE_URL_CHECKOUT);

    if (!Messages) {
        return null;
    } else {

        const orderDetails = Messages.filter((message: any) => {
            const parsedMessage = JSON.parse(message.Body);                
            if (parsedMessage.customerId === customerId) return message;
        });

        if(orderDetails && orderDetails.length > 0){
            return {
                body: orderDetails[0].Body as string,
                receiptHandle: orderDetails[0].ReceiptHandle as string,
            };
        } else return null;
    };
};
