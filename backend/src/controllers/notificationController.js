// Lấy danh sách thông báo theo phòng ban, role, trạng thái
export async function getNotificationsByDepartment(req, res) {
  try {
    const { departments, status } = req.query;
    const { role, department: userDept } = req.user;
    let filter = {};
    if (departments) {
      const deptArr = departments.split(",");
      filter.department = { $in: deptArr };
    }
    if (status) {
      filter.status = status;
    }
    if (role === "manager" || role === "instructor") {
      filter.department = userDept;
    }
    if (role === "student") {
      filter.user = req.user._id;
    }
    const notifications = await Notification.find(filter);
    res.json(notifications);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
export async function deleteNotification(req, res) {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification)
      return res.status(404).json({ error: "Notification not found" });
    res.json({ message: "Notification deleted" });
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: err.message });
  }
}
import Notification from "../models/Notification.js";
import logger from "../utils/logger.js";

export async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find({ user: req.user._id });
    res.json(notifications);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function markAsRead(req, res) {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!notification)
      return res.status(404).json({ error: "Notification not found" });
    res.json(notification);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(400).json({ error: err.message });
  }
}

export async function createNotification(req, res) {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(400).json({ error: err.message });
  }
}
