import smtplib
import random
import string
import os
import time
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

# In-memory OTP store: { email: { otp, expires_at } }
otp_store = {}
OTP_EXPIRY = 600  # 10 minutes

def generate_otp() -> str:
    return ''.join(random.choices(string.digits, k=6))

def save_otp(email: str, otp: str):
    otp_store[email] = {
        "otp": otp,
        "expires_at": time.time() + OTP_EXPIRY
    }
    print(f"OTP for {email}: {otp}")  # for debugging

def verify_otp(email: str, otp: str) -> bool:
    entry = otp_store.get(email)
    if not entry:
        return False
    if time.time() > entry["expires_at"]:
        del otp_store[email]
        return False
    if entry["otp"] == otp:
        del otp_store[email]
        return True
    return False

def send_otp_email(email: str, otp: str, name: str) -> bool:
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "BharatPath — Email Verification Code"
        msg["From"] = EMAIL_ADDRESS
        msg["To"] = email

        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
            <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 24px;">
                    <h1 style="color: #16a34a; font-size: 28px; margin: 0;">🌾 BharatPath</h1>
                    <p style="color: #666; margin: 4px 0;">किसान का साथी</p>
                </div>
                <h2 style="color: #1f2937; font-size: 20px;">Hello, {name}! 👋</h2>
                <p style="color: #4b5563;">Please use the following OTP to verify your email address:</p>
                <div style="background: #f0fdf4; border: 2px solid #16a34a; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
                    <p style="margin: 0; color: #666; font-size: 14px;">Your Verification Code</p>
                    <h1 style="margin: 8px 0; color: #16a34a; font-size: 48px; letter-spacing: 12px; font-weight: bold;">{otp}</h1>
                    <p style="margin: 0; color: #999; font-size: 12px;">Valid for 10 minutes</p>
                </div>
                <p style="color: #6b7280; font-size: 14px;">If you did not register on BharatPath, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
                <p style="color: #9ca3af; font-size: 12px; text-align: center;">BharatPath — AI Decision Support System for Indian Farmers</p>
            </div>
        </body>
        </html>
        """
        msg.attach(MIMEText(html, "html"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.sendmail(EMAIL_ADDRESS, email, msg.as_string())
        print(f"OTP email sent to {email}")
        return True
    except Exception as e:
        print(f"Email send failed: {e}")
        return False