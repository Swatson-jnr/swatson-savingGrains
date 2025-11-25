import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFarmer extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  age: number;
  phoneNumber: string;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
}

const FarmerSchema = new Schema<IFarmer>(
  {
    name: {
      type: String,
      required: [true, "Farmer name is required"],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [1, "Age must be at least 1"],
      max: [150, "Age must be less than 150"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      default: "Male",
      required: [true, "Age is required"],
      
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "farmers",
  }
);

// Index for faster phone number lookups
FarmerSchema.index({ phoneNumber: 1 });

const Farmer: Model<IFarmer> =
  mongoose.models.Farmer || mongoose.model<IFarmer>("Farmer", FarmerSchema);

export default Farmer;
