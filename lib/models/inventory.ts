import mongoose, { Schema, Document, models } from "mongoose"

export interface IInventory extends Document {
  weight: number
  status: string // e.g., 'on_field', 'in_storage', etc.
  // Add other fields as needed (e.g., owner, warehouse, etc.)
  createdAt?: Date
  updatedAt?: Date
}

const inventorySchema = new Schema<IInventory>(
  {
    weight: { type: Number, required: true },
    status: { type: String, required: true, enum: ["on_field", "in_storage"] },
    // Add other fields here
  },
  { timestamps: true, collection: "inventory" },
)

const Inventory =
  models.Inventory || mongoose.model<IInventory>("Inventory", inventorySchema)

export default Inventory

