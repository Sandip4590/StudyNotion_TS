import { sendVerificationMail } from '@/helpers/sendVerificationMail';
import { logger } from '@/lib/winston';
import mongoose, { Schema, Types, model } from 'mongoose';

export interface IOTP extends Document {
    email: string;
    otp: number;
    createdAt: Date;
}

const otpSchema = new Schema<IOTP>({
    email: {
        type: String,
        trim: true,
    },
    otp: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60,
    },
});
otpSchema.pre('save', async function (next) {
    try {
        await sendVerificationMail(this.email, this.otp);
        logger.info(`OTP mail Sent to ${this.email}`);
    } catch (error) {
        logger.error(
            `Error while sending OTP mail to ${this.email}:${(error as Error).message}`,
        );
    }
    next();
});

export const OTP = mongoose.model('OTP', otpSchema);
