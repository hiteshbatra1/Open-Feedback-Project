import { resend } from "@/lib/resend";
import VerificationEmail from "../../email-templates/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Open Feedback | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return {
      success: true,
      message: "Verification email send successfully",
    };
  } catch (emailError) {
    console.error("Error in sending verification email", emailError);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
