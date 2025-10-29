import { resetLogs } from "../utils/resetLogs";
import cron from "node-cron";

cron.schedule("0 0 */14 * *", async () => {
  console.log("Reiniciando logs cada 2 semanas...");
  await resetLogs();
});
