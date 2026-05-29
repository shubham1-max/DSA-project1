
const { Schema, model } = require("mongoose");
const { nanoid } = require("nanoid");

const problemSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    aiResponse: {
      type: Schema.Types.Mixed,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "complete", "error"],
      default: "pending",
    },

    hintsUsed: {
      type: Number,
      min: 0,
      max: 3,
      default: 0,
    },

    bookmarked: {
      type: Boolean,
      default: false,
    },

    shareId: {
      type: String,
      default: () => nanoid(),
      unique: true,
    },

    isPublic: {
      type: Boolean,
      default: false,
    },

    solvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index: { userId, createdAt }  for fast queries
problemSchema.index({ userId: 1, createdAt: -1 });

const Problem = model("Problem", problemSchema);

module.exports = Problem;