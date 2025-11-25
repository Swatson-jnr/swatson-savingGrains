import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGrainType extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GrainTypeSchema = new Schema<IGrainType>(
  {
    name: {
      type: String,
      required: [true, "Grain type name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "graintypes",
  }
);

const GrainType: Model<IGrainType> =
  mongoose.models.GrainType ||
  mongoose.model<IGrainType>("GrainType", GrainTypeSchema);

export default GrainType;
