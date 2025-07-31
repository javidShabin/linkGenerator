import express from "express";
import {
  createLink,
  deleteLink,
  getAllLinks,
  getLatestLink,
  getPrevLinks,
  trachLinkUsage,
  updateLink,
} from "../controllers/linkController.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.js";
const router = express();

router.post("/create-link", authenticate, authorize("user", "pro"), createLink);

router.get(
  "/get-prev-links",
  authenticate,
  authorize("user", "pro"),
  getPrevLinks
);

router.get("/get-link-count", authenticate, authorize("admin"), getAllLinks)

router.get("/get-latest-link/:userId", getLatestLink)

router.get("/track-link/:slug", trachLinkUsage);

router.put(
  "/update-link/:slug",
  authenticate,
  authorize("user", "pro"),
  updateLink
);

router.delete("/delete-link/:slug", deleteLink);

export default router;
