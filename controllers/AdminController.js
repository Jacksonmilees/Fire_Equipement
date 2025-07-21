import jwt from "jsonwebtoken";
import crypto from "crypto";
import Admin from "../models/AdminModel.js";

const signupAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const newAdmin = new Admin({ email, password });
    await newAdmin.save();

    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      admin: { email: admin.email, role: admin.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  let admin;
  try {
    const { email } = req.body;

    // 1. Get admin based on email
    const admin = await Admin.findOne({ email });

    // Always return success to prevent email enumeration
    if (!admin) {
      return res.status(200).json({
        status: "success",
        message:
          "If your email is registered, you will receive a password reset link",
      });
    }

    // 2. Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await admin.save({ validateBeforeSave: false });

    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "REDGAURD",
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [
          {
            email: admin.email,
          },
        ],

        subject: "Password Reset Request",
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #3498db;
                color: white !important;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
                margin: 15px 0;
              }
              .footer {
                color: #777;
                font-size: 12px;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <p>Hello ${admin.email},</p>
            <p>You requested a password reset. Click the button below to reset your password:</p>
             <a href="${
               process.env.FRONTEND_URL
             }/reset-password/${resetToken}" class="button">
              Reset Password
            </a>
            <p>This link is valid for 24 hours.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <div class="footer">
              <p>© ${new Date().getFullYear()} REDGAURD. All rights reserved.</p>
              <p>This is an automated message - please do not reply directly.</p>
            </div>
          </body>
          </html>
        `,
      }),
    });

    // 4. Handle Brevo API response
    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.json();
      throw new Error(
        `Brevo API error (${brevoResponse.status}): ${
          errorData.message || brevoResponse.statusText
        }`
      );
    }

    res.status(200).json({
      status: "success",
      message: "Password reset link sent to your email",
    });
  } catch (err) {
    console.error("Forgot password error:", err);

    if (admin) {
      admin.passwordResetToken = undefined;
      admin.passwordResetExpires = undefined;
      await admin.save({ validateBeforeSave: false });
    }

    res.status(500).json({
      status: "error",
      message: "There was an error sending the email. Please try again later.",
      error: err.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // 1. Hash the token to compare with database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 2. Find admin by token and check expiration
    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({
        status: "fail",
        message: "Token is invalid or has expired",
      });
    }

    // 3. Update password and clear reset fields
    admin.password = password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;

    await admin.save();

    // 4. Send success response
    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({
      status: "error",
      message: "There was an error resetting your password",
      error: err.message,
    });
  }
};

export { signupAdmin, loginAdmin, forgotPassword, resetPassword };
