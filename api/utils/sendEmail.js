const nodemailer = require("nodemailer");

class Email {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  constructor(email, name, subject, message) {
    this.email = email;
    this.name = name;
    this.subject = subject;
    this.message = message;
  }

  async send() {
    await this.transporter.sendMail({
      from: `DealZone <${process.env.EMAIL}>`,
      to: this.email,
      subject: this.subject,
      text: this.message,
    });
  }
}

module.exports = Email;
