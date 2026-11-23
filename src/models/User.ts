import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: 'USER' | 'ADMIN' | 'BLOOD_ADMIN' | 'SUPER_ADMIN';
  bloodGroup?: string;
  isDonor: boolean;
  city?: string;
  address?: string;
  lastDonationDate?: Date;
  permissions: {
    bloodManagement: boolean;
    hospitalManagement: boolean;
    dispatchManagement: boolean;
    userManagement: boolean;
  };
  badgeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String },
    role: { 
      type: String, 
      enum: ['USER', 'ADMIN', 'BLOOD_ADMIN', 'SUPER_ADMIN'], 
      default: 'USER' 
    },
    bloodGroup: { 
      type: String, 
      enum: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] 
    },
    isDonor: { type: Boolean, default: false },
    city: { type: String },
    address: { type: String },
    lastDonationDate: { type: Date },
    permissions: {
      bloodManagement: { type: Boolean, default: false },
      hospitalManagement: { type: Boolean, default: false },
      dispatchManagement: { type: Boolean, default: false },
      userManagement: { type: Boolean, default: false },
    },
    badgeId: { type: String },
  },
  { timestamps: true }
);

export const UserModel: Model<IUser> = 
  mongoose.models?.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;
