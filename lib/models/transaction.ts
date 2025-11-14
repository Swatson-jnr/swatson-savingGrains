import mongoose, { Schema, Document, models } from "mongoose"

export interface ITransaction extends Document {
  label: string
  date: Date
  user: string
  amount: number
  status: "success" | "failed" | "pending"
  currency: string
  paymentType?: string
  counterparty?: string
  description?: string
  metadata?: Record<string, unknown>
  createdAt?: Date
  updatedAt?: Date
}

const transactionSchema = new Schema<ITransaction>(
  {
    label: { type: String, required: true },
    date: { type: Date, default: Date.now },
    user: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "success",
    },
    currency: { type: String, required: true, default: "GHS" },
    paymentType: { type: String, default: "" },
    counterparty: { type: String, default: "" },
    description: { type: String, default: "" },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
)

transactionSchema.index({ date: -1 })

const Transaction =
  models.Transaction ||
  mongoose.model<ITransaction>("Transaction", transactionSchema)

export default Transaction

