import * as fs from "node:fs/promises";
import path from "node:path";
import User from "../models/user.js";
import jimp from "jimp";

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
