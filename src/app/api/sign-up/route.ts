import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    // Check if a verified user with the same username already exists
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 },
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      // if a user with the same email exists and is verified, return an error
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 },
        );
      } else {
        // if a user with the same email exists but is not verified, update the user with the new data and save it to the database
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeValidity = new Date(Date.now() + 3600000);
        existingUserByEmail.isVerified = true; // Set to verified by default

        await existingUserByEmail.save();
      }
    } else {
      // if no user with the email exists, create a new user and save it to the database
      const hashedPassword = await bcrypt.hash(password, 10);
      const validityDate = new Date();
      validityDate.setHours(validityDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeValidity: validityDate,
        isVerified: true, // Set to verified by default
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    // send verification email
    // const emailResponse = await sendVerificationEmail(
    //   email,
    //   username,
    //   verifyCode,
    // );

    // if (!emailResponse.success) {
    //   return Response.json(
    //     {
    //       success: false,
    //       message: emailResponse.message,
    //     },
    //     { status: 500 },
    //   );
    // }

    return Response.json(
      {
        success: true,
        message: "User registered successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in registring user", error);
    return Response.json(
      {
        success: false,
        message: "Error in registring user",
      },
      {
        status: 500,
      },
    );
  }
}
