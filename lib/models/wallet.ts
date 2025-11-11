import mongoose, { Schema, Document, models } from "mongoose";

export interface IWallet extends Document {
  name: string;
  user: mongoose.Types.ObjectId;
  type: string;
  balance: number;
  currency: string;
  metadata?: Record<string, unknown>;
  system?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const walletSchema = new Schema<IWallet>(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ["cash", "app", "user"] },
    balance: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: "GHS" },
    metadata: { type: Schema.Types.Mixed },
    system: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Wallet = models.Wallet || mongoose.model<IWallet>("Wallet", walletSchema);

export default Wallet;
