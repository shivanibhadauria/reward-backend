const router = require("express").Router();
const contact = require("../models/contact");
const authMiddleware = require("../middlewares/authMiddleware");
const sendMail = require("../utils/mailer");





router.post("/post", authMiddleware,   async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      purchaseAmount,
      email,
      productPurchased,
      invoiceNumber,
    
    } = req.body;

    const earnedPoints = Math.floor(Number(purchaseAmount) / 100);
    const purchaseAmt = Number(purchaseAmount); //

    let customer = await contact.findOne({ phoneNumber });

    if (!customer) {
      customer = new contact({
        name,
        phoneNumber,
        purchaseAmount: purchaseAmt,
        earnedPoints,
        email,
        productPurchased,
        invoiceNumber,
        adminId: req.user.id,
      });
    } else {
      customer.purchaseAmount += purchaseAmt;
      customer.earnedPoints += earnedPoints; // ✅ correct way to update points

      console.log(customer.earnedPoints);
      console.log("Existing Points:", customer.earnedPoints);
      console.log("New Points:", earnedPoints);
    }

    await customer.save();

    //Email content

    const emailBody = `
    <h1>Congratulations!</h1>
    <p>Dear ${name},</p>
    <p>We are pleased to inform you that you have earned ${earnedPoints} points for your recent purchase of ${purchaseAmt} from our store.</p>
    <p>Your current points balance is ${customer.earnedPoints}.</p>
    <p>Thank you for shopping with us!</p>
    <p>Best regards,</p>
    <p>The Store Team</p>

    `;

    // Send email

    await sendMail({
      to: email,
      subject: "Congratulations! You have earned points",
      html: emailBody,
    });
    console.log("Email sent successfully to " + email);

    res.status(200).json({ message: "Customer added and email seny" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error saving contact" });
  }
});

router.get("/",  authMiddleware,  async (req, res) => {
  try {
    const contacts = await contact.find({adminId: req.user.id});
    res.status(200).json(contacts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching contacts" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  
  const id = req.params.id;
  const { name, email} = req.body;

  try {
    const updatedContact = await contact.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json({massage: "Contact updated successfully", contact: updatedContact});

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating contact" });
  }
})

router.delete("/:id", authMiddleware, async (req, res) => {
  const id = req.params.id;

  try {
    const deletedContact = await contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json({ message: "Contact deleted successfully" });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting contact" });
  }
})



module.exports = router;
