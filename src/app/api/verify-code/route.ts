import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    // Decode the username to handle any special characters from the URL
    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json({
        success: false,
        message: "User not found",
      });
    }

    const isCodeCorrect = user.verifyCode === code;

    const isCodeValid = new Date(user.verifyCodeValidity) > new Date();

    if (isCodeCorrect && isCodeValid) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        { status: 200 },
      );
    } else if (!isCodeValid) {
      return Response.json(
        {
          status: false,
          message:
            "Verification code is not valid. Please sign up again to generate new code",
        },
        { status: 400 },
      );
    } else {
      return Response.json({
        success: false,
        message: "Incorrect verification code",
      });
    }
  } catch (error) {
    console.error("Error verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying response",
      },
      {
        status: 500,
      },
    );
  }
}
