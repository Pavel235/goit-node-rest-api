import * as fs from "node:fs/promises";
import path from "node:path";
import User from "../models/user.js";
import jimp from "jimp";
import HttpError from "../helpers/HttpError.js";
import mail from "../mail/mail.js";

export async function userAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).send("Please select the avatar file");
    }

    const userAvatar = await jimp.read(req.file.path);
    await userAvatar.cover(250, 250).writeAsync(req.file.path);

    const newPath = path.resolve("public/avatars", req.file.filename);

    await fs.rename(req.file.path, newPath);

    const user = await User.findByIdAndUpdate(
      {
        _id: req.user.id,
      },
      { avatarURL: `/avatars/${req.file.filename}` },
      { new: true }
    );

    res.status(200).send({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
}

export async function verifyUserByToken(req, res, next) {
  const { verificationToken } = req.params;
  try {
    const user = await User.findOne({ verificationToken });

    if (user === null) {
      throw HttpError(404);
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.status(200).send({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
}

export async function repeatVerify(req, res, next) {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).send({ message: "Please enter correct email" });
    }

    const user = await User.findOne({ email });
    const token = user.verificationToken;

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.verify === true) {
      return res
        .status(400)
        .send({ message: "Verification has already been passed" });
    }

    await mail.sendMail(email);

    res.status(200).send({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
}
