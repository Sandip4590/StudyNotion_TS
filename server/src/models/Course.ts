import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface ICourse extends Document {
    courseName: string;
    courseDescription: string;
    instructor: Types.ObjectId;
    whatYouWillLearn: string;
    courseContent: Types.ObjectId[];
    ratingAndReview?: Types.ObjectId[];
    price: number;
    tag?: Types.ObjectId;
    thumbnail?: string;
    studentEnrolled: Types.ObjectId[];
}

const courseSchema = new Schema<ICourse>(
    {
        courseName: {
            type: String,
            trim: true,
        },
        courseDescription: {
            type: String,
            trim: true,
        },
        instructor: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        whatYouWillLearn: {
            type: String,
            trim: true,
        },
        courseContent: [
            {
                type: Schema.Types.ObjectId,
                ref: "Section",
            },
        ],
        ratingAndReview: [
            {
                type: Schema.Types.ObjectId,
                ref: "RatingAndReview",
            },
        ],
        price: {
            type: Number,
        },
        tag: {
            type: Schema.Types.ObjectId,
            ref: "Tag",
        },
        thumbnail: {
            type: String,
        },
        studentEnrolled: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

export const Course: Model<ICourse> = mongoose.model<ICourse>(
    "Course",
    courseSchema
);
