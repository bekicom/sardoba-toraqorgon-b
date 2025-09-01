const Hall = require("../models/hall.model");
const Table = require("../models/Table");

// 🔹 Yangi zal yaratish
exports.createHall = async (req, res) => {
  try {
    const hall = await Hall.create(req.body);
    res.status(201).json(hall);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🔹 Barcha zallarni olish (ichidagi stollar bilan)
exports.getAllHalls = async (req, res) => {
  try {
    const halls = await Hall.find().lean();

    // Har bir zalga stollarni bog‘lab qaytaramiz
    const hallsWithTables = await Promise.all(
      halls.map(async (hall) => {
        const tables = await Table.find({ hall: hall._id });
        return { ...hall, tables };
      })
    );

    res.json(hallsWithTables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Bitta zalni olish (stollar bilan)
exports.getHallById = async (req, res) => {
  try {
    const hall = await Hall.findById(req.params.id).lean();
    if (!hall) return res.status(404).json({ message: "Zal topilmadi" });

    const tables = await Table.find({ hall: hall._id });
    res.json({ ...hall, tables });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Zalni yangilash
exports.updateHall = async (req, res) => {
  try {
    const hall = await Hall.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!hall) return res.status(404).json({ message: "Zal topilmadi" });
    res.json(hall);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🔹 Zalni o‘chirish
exports.deleteHall = async (req, res) => {
  try {
    const hall = await Hall.findByIdAndDelete(req.params.id);
    if (!hall) return res.status(404).json({ message: "Zal topilmadi" });

    // Shu zalga tegishli stollarni ham o‘chirib tashlaymiz
    await Table.deleteMany({ hall: hall._id });

    res.json({ message: "Zal va uning stollari o‘chirildi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
