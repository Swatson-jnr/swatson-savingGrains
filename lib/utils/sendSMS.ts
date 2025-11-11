import axios from "axios";

export const sendSMS = async (to: string, message: string) => {
  try {
    const response = await axios.post(
      `${process.env.ARKESEL_BASE_URL}/sms/send`,
      {
        sender: process.env.ARKESEL_SENDER_ID,
        message,
        recipients: [to],
      },
      {
        headers: {
          "api-key": process.env.ARKESEL_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ SMS sent:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Failed to send SMS:", error.response?.data || error.message);
    throw new Error("SMS send failed");
  }
};
