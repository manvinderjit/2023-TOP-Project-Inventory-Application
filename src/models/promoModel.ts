import mongoose from 'mongoose';

const Schema = mongoose.Schema;

enum PromoStatus {
    Active = 'Active', Expired = 'Expired'
};

enum PromoCategory {
    Carousel = 'Carousel',
    Others = 'Others',
}

const promoSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 30,
            trim: true,
        },
        caption: {
            heading: {
                type: String,
                required: true,
                minLength: 3,
                maxLength: 30,
                trim: true,
            },
            description: {
                type: String,
                required: true,
                minLength: 10,
                maxLength: 100,
                trim: true,
            },
        },
        category: {
            type: String,
            enum: PromoCategory,
            trim: true,
            required: true,
        },
        imageUrl: {
            type: String,
            trim: true,
        },
        imageFilename: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: PromoStatus,
            required: true,
            trim: true,
        },
        startsOn: {
            type: Date,
            required: true,
            get: (date: { toLocaleDateString: () => any }) =>
                date.toLocaleDateString(),
            // TODO: Add validation
            // min: new Date(),
            // validate: {
            //     validator: function (input) {
            //         return (
            //             typeof new Date(input) === 'date' &&
            //             new Date(input) >= new Date()
            //         );
            //     },
            //     message: (props) =>
            //         `${props.value} Date must be in valid format and greater than today's date!`,
            // },
        },
        endsOn: {
            type: Date,
            required: true,
            get: (date: { toLocaleDateString: () => any }) =>
                date.toLocaleDateString(),
            // TODO: Add validation
            // min: new Date(),
            // validate: {
            //     validator: function (input) {
            //         return (
            //             typeof new Date(input) === 'date' &&
            //             new Date(input) >= new Date()
            //         );
            //     },
            //     message: (props) =>
            //         `${props.value} Date must be in valid format and greater than today's date!`,
            // },
        },
    },
    {
        timestamps: true,
        toJSON: { getters: true, virtuals:true, },
        toObject: { virtuals: true },
    },
);

// Virtual for promo's URL
const promoURL = promoSchema.virtual('url');
promoURL.get(function () {
    return `/promos/${this._id}`;
});

const Promo = mongoose.model('Promo', promoSchema);

export default Promo;
