import mongoose, { Schema, Document, models } from "mongoose";

export interface IWalletRequest extends Document {
  user: mongoose.Types.ObjectId;
  amount: number;
  payment_method?: "Cash Payment" | "Mobile Money" | "Bank Transfer";
  provider?: string;
  phone_number?: string;
  bank_name?: string;
  branch_name?: string;
  reason?: string;
  status: "pending" | "approved" | "rejected" | "cancelled" | "successful";
  reviewed_by?: mongoose.Types.ObjectId;
  reviewed_at?: Date;
  rejectionReason?: string; // Reason for rejection/decline
  confirmed_at?: Date; // When receipt was confirmed
  createdAt?: Date;
  updatedAt?: Date;
}

const walletRequestSchema = new Schema<IWalletRequest>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    payment_method: {
      type: String,
      enum: ["Cash Payment", "Mobile Money", "Bank Transfer"],
      required: false, // Optional at creation
      default: null,
    },
    provider: String,
    phone_number: String,
    bank_name: String,
    branch_name: String,
    reason: {
      type: String,
      required: false, // Optional
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "cancelled",
        "successful",
        "declined",
      ],
      default: "pending",
    },
    reviewed_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviewed_at: Date,
    rejectionReason: String,
    confirmed_at: Date,
  },
  { timestamps: true }
);

// Add a virtual field for user_id as an alias for user
walletRequestSchema
  .virtual("user_id")
  .get(function (this: { user: mongoose.Types.ObjectId }) {
    return this.user;
  });

const WalletRequest =
  models.WalletRequest ||
  mongoose.model<IWalletRequest>("WalletRequest", walletRequestSchema);

export default WalletRequest;
