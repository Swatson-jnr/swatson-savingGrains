import mongoose, { Schema, Document, models } from "mongoose";

export interface ICountry extends Document {
  name: string;
  flag: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const countrySchema = new Schema<ICountry>(
  {
    name: {
      type: String,
      required: [true, "Country name is required"],
      unique: true,
      trim: true,
    },
    flag: {
      type: String,
      required: [true, "Country flag is required"],
      validate: {
        validator: function (value: string) {
          const isImage = /\.(png|jpg|jpeg|svg|webp)$/i.test(value);
          const isEmoji =
            /^[\uD83C][\uDFFB-\uDFFF]?[\uD83C][\uDFFB-\uDFFF]?$/.test(value);
          return isImage || isEmoji;
        },
        message: "Flag must be an emoji or an image URL",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Add index
// countrySchema.index({ name: 1 });

const Country =
  models.Country || mongoose.model<ICountry>("Country", countrySchema);

export default Country;
