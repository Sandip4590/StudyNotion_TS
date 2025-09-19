import mongoose, { Schema, Document, Types, model } from 'mongoose';

export interface ITag extends Document {
    name: string;
    description: string;
    courese: Types.ObjectId[];
}

const tagSchema = new Schema<ITag>({
    name: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    courese: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
        },
    ],
});
export default model<ITag>('Tag', tagSchema);

