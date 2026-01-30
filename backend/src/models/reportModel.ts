import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  userId: string;
  productName: string;
  price: number;
  unit: string;
  storeName: string;
  area: string;
  verificationMethod: string;
  status: 'pending' | 'verified' | 'flagged';
  verifiedBy?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters'],
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: {
        values: ['kg', 'liter', 'piece', 'dozen', 'gram', 'quintal'],
        message: '{VALUE} is not a valid unit',
      },
    },
    storeName: {
      type: String,
      required: [true, 'Store name is required'],
      trim: true,
      maxlength: [200, 'Store name cannot exceed 200 characters'],
    },
    area: {
      type: String,
      required: [true, 'Area is required'],
      trim: true,
      maxlength: [200, 'Area cannot exceed 200 characters'],
    },
    verificationMethod: {
      type: String,
      default: 'manual',
      enum: ['manual'],
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'verified', 'flagged'],
    },
    verifiedBy: {
      type: String,
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
reportSchema.index({ userId: 1, createdAt: -1 });
reportSchema.index({ productName: 1, area: 1, createdAt: -1 });
reportSchema.index({ status: 1 });

export const Report = mongoose.model<IReport>('Report', reportSchema);