const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Stol nomi majburiy"],
      trim: true,
    },
    number: {
      type: String,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["bo'sh", "band", "yopilgan"],
      default: "bo'sh",
    },
    guest_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    capacity: {
      type: Number,
      default: 4,
      min: 1,
      max: 20,
    },
    description: {
      type: String,
      trim: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },

    // ✅ Zal bilan bog‘lash (majburiy)
    hall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hall",
      required: [true, "Stol qaysi zaldaligini ko‘rsatish kerak"],
    },
  },
  {
    timestamps: true,
  }
);

//
// 🔹 Virtual field
//
tableSchema.virtual("display_name").get(function () {
  return this.number || this.name;
});

//
// 🔹 Methods
//
tableSchema.methods.getTableInfo = function () {
  return {
    id: this._id,
    name: this.name,
    number: this.number,
    display_name: this.display_name,
    status: this.status,
    guest_count: this.guest_count,
    capacity: this.capacity,
    hall: this.hall, // Zal ID qaytadi
  };
};

//
// 🔹 Statics
//
tableSchema.statics.findActiveTables = function () {
  return this.find({ is_active: true })
    .sort({ name: 1 })
    .populate("hall", "name is_active"); // faqat kerakli hall fieldlarni olib keladi
};

tableSchema.statics.findAvailableTables = function () {
  return this.find({
    is_active: true,
    status: "bo'sh",
  })
    .sort({ name: 1 })
    .populate("hall", "name is_active");
};

//
// 🔹 Pre-save (number auto-generate)
//
tableSchema.pre("save", function (next) {
  if (!this.number && this.name) {
    const numberMatch = this.name.match(/(\d+|[A-Za-z]+\d*)/);
    this.number = numberMatch ? numberMatch[0] : this.name;
  }
  next();
});

//
// 🔹 Virtuallarni JSON va Object da ham ko‘rsatish
//
tableSchema.set("toJSON", { virtuals: true });
tableSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Table", tableSchema);
