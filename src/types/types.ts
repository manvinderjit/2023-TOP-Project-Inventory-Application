import { Document, Types } from "mongoose";

export interface CategoryDetailsDocument extends Document {
    _id: Types.ObjectId;
    name: string;
    description: string;
    url: string;
};

interface PromoEditDetails extends Document {
    caption: {
        heading: string;
        description: string;
    };
    _id: Types.ObjectId;
    name: string;
    category: string;
    imageUrl: string;
    status: string;
    startsOn: string;
    endsOn: string;
    createdAt: string;
    updatedAt: string;
    imageFilename: string;
    url: string;
    id: string;
}