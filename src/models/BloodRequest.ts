import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBloodRequest extends Document {
  patientName: string;
  bloodGroup: 'O-' | 'O+' | 'A-' | 'A+' | 'B-' | 'B+' | 'AB-' | 'AB+';
  unitsNeeded: number;
  hospital: string;
  city: string;
  urgency: 'CRITICAL' | 'URGENT' | 'STANDARD';
  contactNumber: string;
  requesterName: string;
  status: 'PENDING' | 'MATCHING' | 'FULFILLED' | 'CANCELLED';
  description?: string;
  matchedDonorIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const BloodRequestSchema = new Schema<IBloodRequest>(
  {
    patientName: { type: String, required: true },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    },
    unitsNeeded: { type: Number, required: true, default: 1 },
    hospital: { type: String, required: true },
    city: { type: String, required: true },
    urgency: {
      type: String,
      enum: ['CRITICAL', 'URGENT', 'STANDARD'],
      default: 'URGENT',
    },
    contactNumber: { type: String, required: true },
    requesterName: { type: String, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'MATCHING', 'FULFILLED', 'CANCELLED'],
      default: 'PENDING',
    },
    description: { type: String },
    matchedDonorIds: [{ type: Schema.Types.ObjectId, ref: 'Donor' }],
  },
  { timestamps: true }
);

export const BloodRequestModel: Model<IBloodRequest> =
  mongoose.models?.BloodRequest || mongoose.model<IBloodRequest>('BloodRequest', BloodRequestSchema);

export default BloodRequestModel;
