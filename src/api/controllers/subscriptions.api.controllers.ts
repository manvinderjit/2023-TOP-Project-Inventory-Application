import { Request, Response, NextFunction } from "express";
import { validateEmail, validateIsMongoObjectId } from "../../utilities/validation.js";
import { checkEmailSubscriptionStatus, subscribeEmailToTopic, unsubscribeEmailSubscription } from "../../common/services/sns.aws.services.js";

export const getSubscriptionStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, username } = req;  

        // Validate UserId
        if (!userId || userId === null || !validateIsMongoObjectId(userId) || !username || username === null || !validateEmail(username)) {
            return res.status(401).json({
                error: 'Login Expired!',
            });
        } else {
            const subscribed = await checkEmailSubscriptionStatus(username);
            if(subscribed === 'pending') {                
                res.status(200).json({ subscribed: 'pending' });
            } else 
            res.status(200).json({ subscribed });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const postUnsubscribeToNewProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, username } = req;

        // Validate UserId
        if (
            !userId ||
            userId === null ||
            !validateIsMongoObjectId(userId) ||
            !username ||
            username === null ||
            !validateEmail(username)
        ) {
            return res.status(401).json({
                error: 'Login Expired!',
            });
        } else {
            const unsubStatus = await unsubscribeEmailSubscription(username);
            if(unsubStatus === null){
                res.status(400).send('Subscription not found!');
            } else if(unsubStatus !== false && unsubStatus?.$metadata?.httpStatusCode === 200){
                res.status(200).json({ message: 'You have unsubscribed successfully!'});
            } else {
                res.status(400).send('Something went wrong!');
            }
        }        
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const postSubscribeToNewProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, username } = req;

        // Validate UserId
        if (
            !userId ||
            userId === null ||
            !validateIsMongoObjectId(userId) ||
            !username ||
            username === null ||
            !validateEmail(username)
        ) {
            return res.status(401).json({
                error: 'Login Expired!',
            });
        } else {
            // Check subscription status
            const subscribed = await checkEmailSubscriptionStatus(username);
            if (subscribed === false){
                const subStatus = await subscribeEmailToTopic(username);                
                if(subStatus !== false && subStatus.$metadata.httpStatusCode === 200) {                    
                    return res.status(200).json({ message: 'Success! Please check your email for a subscription confirmation link!' });
                } else {
                    return res.status(400).send('Something went wrong!');
                }
            } else if (subscribed === 'pending') {
                return res
                    .status(400)
                    .send(
                        'You are already subscribed! Please check your email for confirmation',
                    );
            } else if (subscribed === true) {
                return res
                    .status(400)
                    .send(
                        'You are already subscribed!',
                    );
            } else return res.status(400).send('Something went wrong!');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};
