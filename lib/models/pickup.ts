import mongoose, { Schema, Document, models } from "mongoose"

export interface IPickupFrom {
  name?: string
  source?: string
}

export interface IPickup extends Document {
  grain: string
  quantity: number
  receivedQuantity: number
  from: IPickupFrom
  status: string // pending, accepted, declined
  createdAt?: Date
  updatedAt?: Date
}

const PickupSchema = new Schema<IPickup>(
  {
    grain: { type: String, required: true },
    quantity: { type: Number, required: true },
    receivedQuantity: { type: Number, default: 0 },
    from: {
      name: { type: String },
      source: { type: String },
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  { timestamps: true, collection: "pickups" },
)

const Pickup = models.Pickup || mongoose.model<IPickup>("Pickup", PickupSchema)

export default Pickup

