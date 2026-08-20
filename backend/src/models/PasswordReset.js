import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    tokenHash: {
      type: String,
      required: [true, "Token hash is required"],
      select: false,
    },
    expiresAt: {
      type: Date,
      required: [true, "Expiration date is required"],
      index: { expireAfterSeconds: 0 },
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        delete ret.tokenHash;
        return ret;
      },
    },
  }
);

const PasswordReset = mongoose.model("PasswordReset", passwordResetSchema);

export default PasswordReset;