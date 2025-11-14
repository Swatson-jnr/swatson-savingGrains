import mongoose, { Schema, Document, models } from "mongoose"

export interface IInventoryActivityDetails {
  grain: string
  action: string
  quantity?: number
  payment?: Record<string, unknown>
  toWarehouse?: { id?: string; name?: string }
  fromWarehouse?: { id?: string; name?: string }
}

export interface IInventoryActivity extends Document {
  details: IInventoryActivityDetails
  createdAt?: Date
  updatedAt?: Date
}

const InventoryActivitySchema = new Schema<IInventoryActivity>(
  {
    details: {
      grain: { type: String, required: true },
      action: { type: String, required: true },
      quantity: { type: Number },
      payment: { type: Schema.Types.Mixed },
      toWarehouse: {
        id: { type: String },
        name: { type: String },
      },
      fromWarehouse: {
        id: { type: String },
        name: { type: String },
      },
    },
  },
  { timestamps: true, collection: "inventory_activities" },
)

const InventoryActivity =
  models.InventoryActivity ||
  mongoose.model<IInventoryActivity>(
    "InventoryActivity",
    InventoryActivitySchema,
  )

export default InventoryActivity

