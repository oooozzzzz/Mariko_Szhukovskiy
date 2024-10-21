// const { Bot, session } = require("grammy");
// const { adminMenu } = require("./menus/adminMenu");
// const {
// 	conversations,
// 	createConversation,
// } = require("@grammyjs/conversations");
// const { hydrate } = require("@grammyjs/hydrate");
// const { I18n } = require("@grammyjs/i18n");
// const { startMenu } = require("./menus/startMenu");
// const { ownerMenu } = require("./menus/ownerMenu");
// const { setShopUrl } = require("./conversations/setShopUrl");
// const { changeAdminPassword } = require("./conversations/changeAdminPassword");
// const { changeOwnerPassword } = require("./conversations/changeOwnerPassword");
// const {
// 	handleNegativeReview,
// } = require("./conversations/handleNegativeReview");
// const { notifyUsers } = require("./conversations/notifyUsers");
// const {
// 	handlePositiveReview,
// } = require("./conversations/handlePositiveComment");
// const { createPoll } = require("./conversations/createPoll");
// require("dotenv").config();
import * as dotenv from "dotenv";
dotenv.config();

import { Bot, session } from "grammy";
import { hydrate } from "@grammyjs/hydrate";
import { I18n } from "@grammyjs/i18n";
import { conversations, createConversation } from "@grammyjs/conversations";
import { hydrateReply, parseMode } from "@grammyjs/parse-mode";
import { startMenu } from "./menus/startMenu.js";
import { v4 as uuidv4 } from 'uuid';
import { adminMenu } from "./menus/adminMenu.js";
import { ownerMenu } from "./menus/ownerMenu.js";
import { changeAdminPassword } from "./conversations/changeAdminPassword.js";
import { changeOwnerPassword } from "./conversations/changeOwnerPassword.js";
import { answerQuestion } from "./conversations/answerConversation.js";
import { askQuestion } from "./conversations/askConversation.js";
import { notifyUsers } from "./conversations/notifyUsers.js";
import { bookTable } from "./conversations/bookTableConversation.js";
import { setMenuConversation } from "./conversations/setMenuConversation.js";


const token = process.env.TOKEN;

export const bot = new Bot(token);

bot.use(hydrateReply);

// Set the default parse mode for ctx.reply.
bot.api.config.use(parseMode("HTML"));

const i18n = new I18n({
	defaultLocale: "ru",
	useSession: true, // whether to store user language in session
	directory: "locales", // Load all translation files from locales/.
});

bot.use(hydrate());
bot.use(
	session({
		initial() {
			return {
				toChat: false,
				thread_id: uuidv4()
			};
		},
	})
);

bot.use(i18n);

bot.api.setMyCommands([
	{ command: "start", description: "Перейте в главное меню" },
]);

bot.use(conversations());
// bot.use(createConversation(setShopUrl));
bot.use(createConversation(changeAdminPassword));
bot.use(createConversation(changeOwnerPassword));
bot.use(createConversation(answerQuestion));
bot.use(createConversation(askQuestion));
bot.use(createConversation(bookTable));
bot.use(createConversation(setMenuConversation));
// bot.use(createConversation(handleNegativeReview));
// bot.use(createConversation(handlePositiveReview));
// bot.use(createConversation(createPoll));
bot.use(createConversation(notifyUsers));
bot.use(startMenu);
bot.use(adminMenu);
bot.use(ownerMenu);
