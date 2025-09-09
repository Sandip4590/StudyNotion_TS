import mongoose, { Schema, model } from 'mongoose';
import brcypt from 'bcrypt'

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  contactNumber: number;
  accountType: 'Admin' | 'Instructor' | 'student';
  image: string;
  courses: mongoose.Types.ObjectId[];
  additionalDetails: mongoose.Types.ObjectId;
  couresProgress?: mongoose.Types.ObjectId;
  token?: string;
  resetPasswordExpires?: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,

      trim: true,
    },
    lastName: {
      type: String,

      trim: true,
    },
    email: {
      type: String,

      trim: true,
      lowercase: true,
    },
    password: {
      type: String,

      select: false,
    },
    confirmPassword: {
      type: String,

      select: false,
    },
    accountType: {
      type: String,
      enum: {
        values: ['Admin', 'Instructor', 'student'],
      },
      default: 'student',
    },
    image: {
      type: String,
      required: [true, 'Profile image is required'],
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'additionaDetails',
    },

    couresProgress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CourseProgress',
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);
userSchema.pre('save' ,async function (next) {
    if(!this.isModified('password')){
        next();
        return;
    }
    this.password = await brcypt.hash(this.password , 10)
    next();
    
})

export default model<IUser>('User', userSchema);
