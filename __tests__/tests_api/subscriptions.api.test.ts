import { jest } from '@jest/globals';
import { mockClient } from 'aws-sdk-client-mock';
import {
    SNSClient,    
    SubscribeCommand,
    ListSubscriptionsByTopicCommand,
    UnsubscribeCommand,
} from '@aws-sdk/client-sns';
import {
    getSubscriptionStatus,
    postSubscribeToNewProducts,
    postUnsubscribeToNewProducts,
} from '../../src/api/controllers/subscriptions.api.controllers';

const snsMock = mockClient(SNSClient);

describe("GET Subscription Status", () => {
    
    beforeEach(() => {
        snsMock.reset();
    });

    it("should get the current subscription status of the user when the user is subscribed", async () => {
        const req: any = {            
            userId: '654715c5941455dd27f32425',
            username: 'dummy@email.com',
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        snsMock.on(ListSubscriptionsByTopicCommand).resolvesOnce({
            '$metadata': {
                httpStatusCode: 200,
                requestId: 'b791aec1-0b29-50da-950b-f1794e250710',
                extendedRequestId: undefined,
                cfId: undefined,
                attempts: 1,
                totalRetryDelay: 0
            },
            Subscriptions: [
                {
                    SubscriptionArn: 'arn:aws:sns:us-east-1:623537709549:ia-new-product:0a0f97ce-c314-4f4a-980c-741eeadca34c',
                    Owner: '623537709549',
                    Protocol: 'email',
                    Endpoint: 'dummy@email.com',
                    TopicArn: 'arn:aws:sns:us-east-1:623537709549:ia-new-product'
                }
            ],
        });

        await getSubscriptionStatus(req, res, next);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ subscribed: true });
        expect(next).not.toHaveBeenCalled();
    });

    it('should get the current subscription status of the user when the user subscription is pending', async () => {
        const req: any = {
            userId: '654715c5941455dd27f32425',
            username: 'dummy@email.com',
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        snsMock.on(ListSubscriptionsByTopicCommand).resolvesOnce({
            $metadata: {
                httpStatusCode: 200,
                requestId: 'b791aec1-0b29-50da-950b-f1794e250710',
                extendedRequestId: undefined,
                cfId: undefined,
                attempts: 1,
                totalRetryDelay: 0,
            },
            Subscriptions: [
                {
                    SubscriptionArn:
                        'PendingConfirmation',
                    Owner: '623537709549',
                    Protocol: 'email',
                    Endpoint: 'dummy@email.com',
                    TopicArn:
                        'arn:aws:sns:us-east-1:623537709549:ia-new-product',
                },
            ],
        });

        await getSubscriptionStatus(req, res, next);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ subscribed: 'pending' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should get the current subscription status of the user when the user is not subscribed', async () => {
        const req: any = {
            userId: '654715c5941455dd27f32425',
            username: 'dummy@email.com',
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        snsMock.on(ListSubscriptionsByTopicCommand).resolvesOnce({
            $metadata: {
                httpStatusCode: 200,
                requestId: 'b791aec1-0b29-50da-950b-f1794e250710',
                extendedRequestId: undefined,
                cfId: undefined,
                attempts: 1,
                totalRetryDelay: 0,
            },
            Subscriptions: [
                {
                    SubscriptionArn: 'PendingConfirmation',
                    Owner: '623537709549',
                    Protocol: 'email',
                    Endpoint: 'not@email.com',
                    TopicArn:
                        'arn:aws:sns:us-east-1:623537709549:ia-new-product',
                },
            ],
        });

        await getSubscriptionStatus(req, res, next);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ subscribed: false });
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully and send an error message when userId is not present', async () => {
        const req: any = {            
            userId: '654715c5941455dd27f32425',
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        snsMock.on(ListSubscriptionsByTopicCommand).resolvesOnce({});

        await getSubscriptionStatus(req, res, next);        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Login Expired!' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully and send an error message when username is not present', async () => {
        const req: any = {
            username: 'dummy@email.com',
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        snsMock.on(ListSubscriptionsByTopicCommand).resolvesOnce({});

        await getSubscriptionStatus(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Login Expired!' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully and send an error message when an unknown error occurs', async () => {
        const req: any = {
            username: 'dummy@email.com',
        };
        const res: any = {
            json: jest.fn(() => { throw new Error('Test Error!')}),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        await getSubscriptionStatus(req, res, next);
        expect(next).toHaveBeenCalledWith(new Error('Test Error!'));
    });
});

describe("POST Subscribe To Offers", () => {
    
    beforeEach(() => {
        snsMock.reset();
    });

    it("should be able to successfully subscribe to offers", async () => {
        const req: any = {
            userId: '654715c5941455dd27f32425',
            username: 'dummy@email.com',
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        snsMock.on(ListSubscriptionsByTopicCommand).resolvesOnce({
            $metadata: {
                httpStatusCode: 200,
                requestId: 'b791aec1-0b29-50da-950b-f1794e250710',
                extendedRequestId: undefined,
                cfId: undefined,
                attempts: 1,
                totalRetryDelay: 0,
            },
            Subscriptions: [
                {
                    SubscriptionArn: 'PendingConfirmation',
                    Owner: '623537709549',
                    Protocol: 'email',
                    Endpoint: 'not@email.com',
                    TopicArn:
                        'arn:aws:sns:us-east-1:623537709549:ia-new-product',
                },
            ],
        });

        snsMock.on(SubscribeCommand).resolvesOnce({
            $metadata: {
                httpStatusCode: 200,
                requestId: '4be572d8-d136-527b-a85b-2d61609c6d71',
                extendedRequestId: undefined,
                cfId: undefined,
                attempts: 1,
                totalRetryDelay: 0,
            },
            SubscriptionArn: 'pending confirmation',
        });

        await postSubscribeToNewProducts(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message:
                'Success! Please check your email for a subscription confirmation link!',
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully and send error message when the user is already subscribed but has not confirmed subscription', async () => {
        const req: any = {
            userId: '654715c5941455dd27f32425',
            username: 'dummy@email.com',
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        snsMock.on(ListSubscriptionsByTopicCommand).resolvesOnce({
            $metadata: {
                httpStatusCode: 200,
                requestId: 'b791aec1-0b29-50da-950b-f1794e250710',
                extendedRequestId: undefined,
                cfId: undefined,
                attempts: 1,
                totalRetryDelay: 0,
            },
            Subscriptions: [
                {
                    SubscriptionArn: 'PendingConfirmation',
                    Owner: '623537709549',
                    Protocol: 'email',
                    Endpoint: 'dummy@email.com',
                    TopicArn:
                        'arn:aws:sns:us-east-1:623537709549:ia-new-product',
                },
            ],
        });

        snsMock.on(SubscribeCommand).resolvesOnce({
            $metadata: {
                httpStatusCode: 200,
                requestId: '4be572d8-d136-527b-a85b-2d61609c6d71',
                extendedRequestId: undefined,
                cfId: undefined,
                attempts: 1,
                totalRetryDelay: 0,
            },
            SubscriptionArn: 'pending confirmation',
        });

        await postSubscribeToNewProducts(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('You are already subscribed! Please check your email for confirmation');
        expect(next).not.toHaveBeenCalled();
    });


    it('should handle errors gracefully and send error message when the user is already subscribed', async () => {
        const req: any = {
            userId: '654715c5941455dd27f32425',
            username: 'dummy@email.com',
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        snsMock.on(ListSubscriptionsByTopicCommand).resolvesOnce({
            $metadata: {
                httpStatusCode: 200,
                requestId: 'b791aec1-0b29-50da-950b-f1794e250710',
                extendedRequestId: undefined,
                cfId: undefined,
                attempts: 1,
                totalRetryDelay: 0,
            },
            Subscriptions: [
                {
                    SubscriptionArn:
                        'arn:aws:sns:us-east-1:623537709549:ia-new-product:0a0f97ce-c314-4f4a-980c-741eeadca34c',
                    Owner: '623537709549',
                    Protocol: 'email',
                    Endpoint: 'dummy@email.com',
                    TopicArn:
                        'arn:aws:sns:us-east-1:623537709549:ia-new-product',
                },
            ],
        });

        snsMock.on(SubscribeCommand).resolvesOnce({
            $metadata: {
                httpStatusCode: 200,
                requestId: '4be572d8-d136-527b-a85b-2d61609c6d71',
                extendedRequestId: undefined,
                cfId: undefined,
                attempts: 1,
                totalRetryDelay: 0,
            },
            SubscriptionArn: 'pending confirmation',
        });

        await postSubscribeToNewProducts(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(
            'You are already subscribed!'
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully and send error message when the sns service throws an error', async () => {
        const req: any = {
            userId: '654715c5941455dd27f32425',
            username: 'dummy@email.com',
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        snsMock.on(ListSubscriptionsByTopicCommand).rejectsOnce();

        snsMock.on(SubscribeCommand).resolvesOnce({
            $metadata: {
                httpStatusCode: 200,
                requestId: '4be572d8-d136-527b-a85b-2d61609c6d71',
                extendedRequestId: undefined,
                cfId: undefined,
                attempts: 1,
                totalRetryDelay: 0,
            },
            SubscriptionArn: 'pending confirmation',
        });

        await postSubscribeToNewProducts(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Something went wrong!');
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully and send error message when the sns service throws an error', async () => {
        const req: any = {
            userId: '654715c5941455dd27f32425',
            username: 'dummy@email.com',
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        snsMock.on(ListSubscriptionsByTopicCommand).resolvesOnce({
            $metadata: {
                httpStatusCode: 200,
                requestId: 'b791aec1-0b29-50da-950b-f1794e250710',
                extendedRequestId: undefined,
                cfId: undefined,
                attempts: 1,
                totalRetryDelay: 0,
            },
            Subscriptions: [
                {
                    SubscriptionArn: 'PendingConfirmation',
                    Owner: '623537709549',
                    Protocol: 'email',
                    Endpoint: 'not@email.com',
                    TopicArn:
                        'arn:aws:sns:us-east-1:623537709549:ia-new-product',
                },
            ],
        });

        snsMock.on(SubscribeCommand).rejectsOnce({});

        await postSubscribeToNewProducts(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Something went wrong!');
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully and send an error message when userId is not present', async () => {
        const req: any = {
            userId: '654715c5941455dd27f32425',
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        snsMock.on(ListSubscriptionsByTopicCommand).resolvesOnce({});

        await postSubscribeToNewProducts(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Login Expired!' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully and send an error message when username is not present', async () => {
        const req: any = {
            username: 'dummy@email.com',
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        snsMock.on(ListSubscriptionsByTopicCommand).resolvesOnce({});

        await postSubscribeToNewProducts(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Login Expired!' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully and send an error message when an unknown error occurs', async () => {
        const req: any = {
            username: 'dummy@email.com',
        };
        const res: any = {
            json: jest.fn(() => {
                throw new Error('Test Error!');
            }),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        await postSubscribeToNewProducts(req, res, next);
        expect(next).toHaveBeenCalledWith(new Error('Test Error!'));
    });
});

describe("POST Cancel Subscription", () => {
    
    beforeEach(() => {
        snsMock.reset();
    });

    it("should successfully cancel subscription and return a success response", async () => {
        const req: any = {
            userId: '654715c5941455dd27f32425',
            username: 'dummy@email.com',
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        snsMock.on(ListSubscriptionsByTopicCommand).resolvesOnce({
            $metadata: {
                httpStatusCode: 200,
                requestId: 'b791aec1-0b29-50da-950b-f1794e250710',
                extendedRequestId: undefined,
                cfId: undefined,
                attempts: 1,
                totalRetryDelay: 0,
            },
            Subscriptions: [
                {
                    SubscriptionArn:
                        'arn:aws:sns:us-east-1:623537709549:ia-new-product:0a0f97ce-c314-4f4a-980c-741eeadca34c',
                    Owner: '623537709549',
                    Protocol: 'email',
                    Endpoint: 'dummy@email.com',
                    TopicArn:
                        'arn:aws:sns:us-east-1:623537709549:ia-new-product',
                },
            ],
        });

        snsMock.on(UnsubscribeCommand).resolvesOnce({
            '$metadata': {
                httpStatusCode: 200,
                requestId: 'd587d7e5-719c-5641-9abf-885ce269f74d',
                extendedRequestId: undefined,
                cfId: undefined,
                attempts: 1,
                totalRetryDelay: 0
            }
        });

        await postUnsubscribeToNewProducts(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'You have unsubscribed successfully!' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully and send appropriate response when the subscription being cancelled is not found', async () => {
        const req: any = {
            userId: '654715c5941455dd27f32425',
            username: 'dummy@email.com',
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        snsMock.on(ListSubscriptionsByTopicCommand).resolvesOnce({
            $metadata: {
                httpStatusCode: 200,
                requestId: 'b791aec1-0b29-50da-950b-f1794e250710',
                extendedRequestId: undefined,
                cfId: undefined,
                attempts: 1,
                totalRetryDelay: 0,
            },
            Subscriptions: [
                {
                    SubscriptionArn:
                        'arn:aws:sns:us-east-1:623537709549:ia-new-product:0a0f97ce-c314-4f4a-980c-741eeadca34c',
                    Owner: '623537709549',
                    Protocol: 'email',
                    Endpoint: 'not@email.com',
                    TopicArn:
                        'arn:aws:sns:us-east-1:623537709549:ia-new-product',
                },
            ],
        });

        snsMock.on(UnsubscribeCommand).resolvesOnce({
            $metadata: {
                httpStatusCode: 200,
                requestId: 'd587d7e5-719c-5641-9abf-885ce269f74d',
                extendedRequestId: undefined,
                cfId: undefined,
                attempts: 1,
                totalRetryDelay: 0,
            },
        });

        await postUnsubscribeToNewProducts(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Subscription not found!');
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully and send appropriate response when the an error occurs in ListSubscriptionsByTopicCommand', async () => {
        const req: any = {
            userId: '654715c5941455dd27f32425',
            username: 'dummy@email.com',
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        snsMock.on(ListSubscriptionsByTopicCommand).rejectsOnce();

        snsMock.on(UnsubscribeCommand).resolvesOnce({
            $metadata: {
                httpStatusCode: 200,
                requestId: 'd587d7e5-719c-5641-9abf-885ce269f74d',
                extendedRequestId: undefined,
                cfId: undefined,
                attempts: 1,
                totalRetryDelay: 0,
            },
        });

        await postUnsubscribeToNewProducts(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Something went wrong!');
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully and send an error message when userId is not present', async () => {
        const req: any = {
            userId: '654715c5941455dd27f32425',
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        snsMock.on(ListSubscriptionsByTopicCommand).resolvesOnce({});

        await postUnsubscribeToNewProducts(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Login Expired!' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully and send an error message when username is not present', async () => {
        const req: any = {
            username: 'dummy@email.com',
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        snsMock.on(ListSubscriptionsByTopicCommand).resolvesOnce({});

        await postUnsubscribeToNewProducts(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Login Expired!' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully and send an error message when an unknown error occurs', async () => {
        const req: any = {
            username: 'dummy@email.com',
        };
        const res: any = {
            json: jest.fn(() => {
                throw new Error('Test Error!');
            }),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        await postUnsubscribeToNewProducts(req, res, next);
        expect(next).toHaveBeenCalledWith(new Error('Test Error!'));
    });
});
