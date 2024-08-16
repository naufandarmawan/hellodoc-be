const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createOrder = async (req, res) => {
  try {
    const { patient_id, items } = req.body;
    const order = await prisma.order.create({
      data: {
        patient_id,
        total_amount: items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
        status: "Pending",
        OrderItem: {
          create: items.map((item) => ({
            medicine_id: item.medicine_id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const { user_id } = req.user;
  
    const orders = await prisma.order.findMany({
      where: { patient_id: user_id },
      include: { OrderItem: true },
    });
    res.json(orders);
  } catch (error) {
    console.log(error);
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: { OrderItem: true },
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderDetails,
};
