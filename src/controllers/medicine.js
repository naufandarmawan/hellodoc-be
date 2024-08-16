const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getMedicines = async (req, res) => {
  try {
    const medicines = await prisma.medicine.findMany();
    res.json(medicines);
  } catch (error) {
    console.log(error);
  }
};

const getMedicineDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await prisma.medicine({ where: { id: parseInt(id) } });
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    res.json(medicine);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getMedicines,
  getMedicineDetails,
};
