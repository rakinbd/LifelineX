import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDonor extends Document {
  userId?: mongoose.Types.ObjectId | string;
  fullName: string;
  bloodGroup: 'O-' | 'O+' | 'A-' | 'A+' | 'B-' | 'B+' | 'AB-' | 'AB+';
  contactNumber: string;
  email: string;
  city: string;
  address?: string;
  lastDonationDate?: Date;
  isAvailable: boolean;
  totalDonations: number;
  cooldownEligible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DonorSchema = new Schema<IDonor>(
  {
    userId: { type: Schema.Types.Mixed },
    fullName: { type: String, required: true },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String },
    lastDonationDate: { type: Date },
    isAvailable: { type: Boolean, default: true },
    totalDonations: { type: Number, default: 0 },
    cooldownEligible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const DonorModel: Model<IDonor> =
  mongoose.models?.Donor || mongoose.model<IDonor>('Donor', DonorSchema);

export default DonorModel;
