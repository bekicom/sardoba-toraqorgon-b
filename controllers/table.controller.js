const Table = require("../models/Table");
const Hall = require("../models/hall.model");

// ➕ Yangi stol yaratish (zal bilan)
const createTable = async (req, res) => {
  try {
    const { name, guest_count, hall, capacity, status, description } = req.body;

    // Zal bor-yo‘qligini tekshiramiz
    const hallExists = await Hall.findById(hall);
    if (!hallExists) {
      return res.status(404).json({ message: "Zal topilmadi" });
    }

    const newTable = await Table.create({
      name,
      guest_count: guest_count || 0,
      capacity: capacity || 4,
      status: status || "bo'sh",
      description,
      hall,
    });

    res.status(201).json({
      message: "Stol yaratildi",
      table: await newTable.populate("hall"),
    });
  } catch (error) {
    res.status(500).json({
      message: "Xatolik",
      error: error.message,
    });
  }
};

// 📋 Barcha stollarni olish (zal bo‘yicha filtr bilan)
const getTables = async (req, res) => {
  try {
    const filter = {};
    if (req.query.hall) {
      filter.hall = req.query.hall;
    }

    const tables = await Table.find(filter)
      .populate("hall")
      .sort({ createdAt: -1 });

    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ message: "Xatolik", error: error.message });
  }
};

// 📝 Stolni yangilash (status, guest_count, name, hall, capacity, description)
const updateTable = async (req, res) => {
  try {
    const { hall } = req.body;

    if (hall) {
      const hallExists = await Hall.findById(hall);
      if (!hallExists) {
        return res.status(404).json({ message: "Zal topilmadi" });
      }
    }

    const updated = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("hall");

    if (!updated) {
      return res.status(404).json({ message: "Stol topilmadi" });
    }

    res.status(200).json({
      message: "Stol yangilandi",
      table: updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Xatolik", error: error.message });
  }
};

// ❌ Stolni o‘chirish
const deleteTable = async (req, res) => {
  try {
    const deleted = await Table.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Stol topilmadi" });
    }

    res.status(200).json({ message: "Stol o‘chirildi" });
  } catch (error) {
    res.status(500).json({ message: "Xatolik", error: error.message });
  }
};

module.exports = {
  createTable,
  getTables,
  updateTable,
  deleteTable,
};
