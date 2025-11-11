import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  passcode: string;
  roles?: string[];
  system: boolean;
  otp?: string | null;
  otp_expires_at?: Date | null;
  walletBalance: number;
  fcm_token?: string | null;
  createdAt?: Date;
  updatedAt?: Date;

  // Instance methods
  isOTPExpired(): boolean;
  clearOTP(): Promise<IUser>;
  full_name?: string;
}

const userSchema = new Schema<IUser>(
  {
    first_name: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    last_name: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone_number: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },
    passcode: {
      type: String,
      required: [true, "4-digit passcode is required"],
    },
    roles: {
      type: [String],
      default: ["field-agent"],
      enum: [
        "super-admin",
        "admin",
        "backoffice-admin",
        "account-manager",
        "paymaster",
        "stock-manager",
        "field-agent",
      ],
    },
    system: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otp_expires_at: {
      type: Date,
      default: null,
    },
    walletBalance: {
      type: Number,
      default: 0,
      min: [0, "Wallet balance cannot be negative"],
    },
    fcm_token: {
      type: String,
      default: null,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
userSchema.index({ email: 1 });
userSchema.index({ phone_number: 1 });
userSchema.index({ otp_expires_at: 1 });

// Virtual: full name
userSchema.virtual("full_name").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

// Instance method: check if OTP expired
userSchema.methods.isOTPExpired = function () {
  if (!this.otp_expires_at) return true;
  return this.otp_expires_at < new Date();
};

// Instance method: clear OTP
userSchema.methods.clearOTP = async function () {
  this.otp = null;
  this.otp_expires_at = null;
  return await this.save();
};

// Avoid recompiling model in dev
const User = models.User || mongoose.model<IUser>("User", userSchema);

export default User;
