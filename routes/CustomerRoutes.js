const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Customer = require("../models/costumerModel");
const {
  validateCreateCustomer,
  validateUpdateCustomer,
} = require("../validators/CostumerValidator");
let customers = [];

router.get("/api/customers", async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

router.get("/api/customers/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send("this is Not a valid ID");
  const customer = await Customer.findById(req.params.id);
  if (customer) res.send(customer);
  else res.status(404).send("not found");
});

//customer creation

router.post("/api/customers", async function (req, res) {
  // input validation
  const { error } = validateCreateCustomer(req.body);
  if (error) return res.status(400).send({ message: error.message });

  let customer = new Customer({
    name: req.body.name,
  });
  customer = await customer.save();
  res.send(customer);
});

router.put("/api/customers/:customerId", async (req, res) => {
  // input validation

  const { error } = validateUpdateCustomer({
    ...req.body,
    customerId: req.params.customerId,
  });
  if (error) return res.status(400).send({ message: error.message });

  let customer = await Customer.findById(req.params.customerId);
  if (!customer)
    return res.status(404).send({ message: "مشتری مورد نظر یافت نشد" });
  customer.name = req.body.name;
  customer = await customer.save();
  res.send(customer);
});

router.delete("/api/customers/:customerId", async (req, res) => {
  await Customer.findByIdAndRemove(req.params.customerId);
  res.status(200).send("deleted");
});

module.exports = router;
