import { Types } from 'mongoose';
import Promo from '../../models/promoModel.js';
import { validateIsNumber } from '../../utilities/validation.js';
import { trimMultipleWhiteSpaces } from '../../utilities/stringFormatting.js';

export const promoCategories = [
    {
        id: 1,
        name: 'Carousel',
    },
    {
        id: 2,
        name: 'Others',
    },
];

// Fetches all promos or based on promo category by referring name from provided promoCategory Id
export const fetchPromos = async (promoCategory: string | null | undefined) => {
    let query = {};
    if (promoCategory && validateIsNumber(promoCategory)) {
        query = { category: promoCategories[Number(promoCategory) - 1].name };
    }
    const allPromos = await Promo.find(query).sort({ name: 1 }).exec();
    return allPromos;
};

export const fetchPromoDetails = async (promoId: string) => {
    const dataPromoDetails = await Promo.findById(promoId)
        .sort({ name: 1 })
        .exec();
    return dataPromoDetails;
};

interface PromoDetailable extends Document {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    category: string;
    name: string;
    status: string;
    startsOn: Date;
    endsOn: Date;
    caption?:
        | {
              heading: string;
              description: string;
          }
        | null
        | undefined;
    imageUrl?: string | null | undefined;
    imageFilename?: string | null | undefined;
}

export const createPromo = async (promoDetails: {
    promoName: string;
    promoCaption: string;
    promoDescription: string;
    promoCategory: number;
    newUploadFileName: any;
    promoStatus: string;
    promoStartDate: string;
    promoEndDate: string;
}) => {
    const createdPromo = await Promo.create({
        name: trimMultipleWhiteSpaces(promoDetails.promoName),
        caption: {
            heading: trimMultipleWhiteSpaces(promoDetails.promoCaption),
            description: trimMultipleWhiteSpaces(promoDetails.promoDescription),
        },
        category: trimMultipleWhiteSpaces(
            promoCategories[promoDetails.promoCategory - 1].name,
        ),
        imageUrl: `promos/carousel/${promoDetails.newUploadFileName}`,
        imageFilename: promoDetails.newUploadFileName,
        status: trimMultipleWhiteSpaces(promoDetails.promoStatus),
        startsOn: trimMultipleWhiteSpaces(promoDetails.promoStartDate),
        endsOn: trimMultipleWhiteSpaces(promoDetails.promoEndDate),
    });
    return createdPromo;
};

export const updatePromo = async (promoId:string, promoDetails: {
    promoName: string;
    promoCaption: string;
    promoDescription: string;
    promoCategory: number;
    newUploadFileName: any;
    promoStatus: string;
    promoStartDate: string;
    promoEndDate: string;
}) => {
    const promoNewData = {
        name: trimMultipleWhiteSpaces(promoDetails.promoName),
        caption: {
            heading: trimMultipleWhiteSpaces(promoDetails.promoCaption),
            description: trimMultipleWhiteSpaces(promoDetails.promoDescription),
        },
        category: trimMultipleWhiteSpaces(
            promoCategories[promoDetails.promoCategory - 1].name,
        ),
        // imageUrl: `promos/carousel/${promoDetails.newUploadFileName}`,
        // imageFilename: promoDetails.newUploadFileName,
        status: trimMultipleWhiteSpaces(promoDetails.promoStatus),
        startsOn: trimMultipleWhiteSpaces(promoDetails.promoStartDate),
        endsOn: trimMultipleWhiteSpaces(promoDetails.promoEndDate),
    };
    const updatedPromo = await Promo.findByIdAndUpdate(promoId, promoNewData);
    return updatedPromo;
};

export const getPromoImageName = async (promoId:string) => {
    const result = await Promo.findById(promoId).select({ imageFilename: 1, _id: 0}).exec();
    return result?.imageFilename;
};

export const deletePromo = async (promoId: string) => {
    return await Promo.findByIdAndDelete(promoId);
};
