import User from "../models/user_model.js";
import { successResponse } from "../utils/response_util.js";

export const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("settings");
    return successResponse(res, 200, "Settings fetched", user?.settings || {});
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { settings: req.body } },
      { new: true, upsert: true }
    ).select("settings");
    return successResponse(res, 200, "Settings updated", user.settings);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

