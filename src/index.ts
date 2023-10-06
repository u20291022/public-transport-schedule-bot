import { Bot } from "./bot/bot";
import { config } from "dotenv";

function main() {
  config();

  const botToken = process.env["BOT_TOKEN"];

  if (!botToken) {
    throw new Error("Enter BOT_TOKEN in .env file!");
  }

  const bot = new Bot(botToken);

  bot.launch();
}

main();