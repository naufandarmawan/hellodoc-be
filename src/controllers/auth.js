const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const registerPatient = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "Patient",
      },
      select: {
        id: true,
        email: true,
        role: true
      },
    });

    const newPatient = await prisma.patient.create({
      data: {
        name,
        user_id: newUser.id
      },
      select: {
        id: true,
        name: true,
        created_at: true,
        updated_at: true
      },
    });

    const result = {
      id: newPatient.id,
      role: newUser.role,
      name: newPatient.name,
      email: newUser.email,
      created_at: newPatient.created_at,
      updated_at: newPatient.updated_at
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const registerDoctor = async (req, res) => {
  try {
    const { name, specialization, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "Doctor",
      },
      select: {
        id: true,
        email: true,
        role: true
      },
    });

    const newDoctor = await prisma.doctor.create({
      data: {
        name,
        specialization,
        user_id: newUser.id
      },
      select: {
        id: true,
        name: true,
        specialization: true,
        created_at: true,
        updated_at: true
      },
    });

    const result = {
      id: newDoctor.id,
      role: newUser.role,
      name: newDoctor.name,
      specialization: newDoctor.specialization,
      email: newUser.email,
      created_at: newDoctor.created_at,
      updated_at: newDoctor.updated_at
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.SECRET_KEY_JWT
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerPatient,
  registerDoctor,
  login,
};
