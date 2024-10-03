import { Document, Types } from "mongoose";

export interface CategoryDetailsDocument extends Document {
    _id: Types.ObjectId;
    name: string;
    description: string;
    url: string;
};
