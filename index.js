// const { bot } = require("./bot");
// const startHandler = require("./handlers/startHandler");
// const adminHandler = require("./handlers/adminHandler");
// const { toMainMenu, toAdminMenu, toOwnerMenu } = require("./routes");
// const ownerHandler = require("./handlers/ownerHandler");
// const { separate } = require("./services");
// const { votePollHandler } = require("./handlers/votePollHandler");
// const AIHandler = require("./handlers/AIHandler");
// const { getAdminPassword, getOwnerPassword } = require("./password");
// const photoHandler = require("./handlers/photoHandler");

import { getBookingData } from "./bookingOrder.js";
import { bot } from "./bot.js";
import { getAdminPassword, getOwnerPassword } from "./db.js";
import { adminHandler } from "./handlers/adminHandler.js";
import { AIHandler } from "./handlers/AIHandler.js";
import { ownerHandler } from "./handlers/ownerHandler.js";
import { questionHandler } from "./handlers/questionsHandler.js";
import { startHandler } from "./handlers/startHandler.js";
import { tableHandler } from "./handlers/tableHandler.js";
import { startMenu } from "./menus/startMenu.js";
import { toAdminMenu, toMainMenu, toOwnerMenu } from "./routes.js";
import { toPref } from "./services.js";

bot.command("start", async (ctx) => startHandler(ctx));
bot.command("chatid", async (ctx) => {
	await ctx.reply(ctx.chat.id);
});

bot.callbackQuery("toMenu", async (ctx) => {
	toMainMenu(ctx);
	ctx.answerCallbackQuery();
});
bot.callbackQuery("yes", async (ctx) => {
	await ctx.reply(`Спасибо за бронирование! Скоро с вами свяжется менеджер для подтверждения. Мы с нетерпением ждем вас в гости в «Хачапури Марико»!
До скорой встречи, Дорогой❤️`);
// console.log(ctx.session)
const order = getBookingData(ctx.from.id)
	const text = `Новый заказ на бронирование столика:
День бронирования: ${order.day}
Время бронирования: ${order.time}
Количество гостей: ${order.guests}
Номер телефона: ${order.number}
Особые пожелания: ${order.wishes}
${ctx.from?.username ? `Телеграм пользователя @${ctx.from?.username}` : `Телеграм пользователя скрыт`}
`;
	await ctx.api.sendMessage(762569950, text);
	await ctx.api.sendMessage(-4580540965, text);
	ctx.answerCallbackQuery();
	await ctx.reply(ctx.t("start"), { reply_markup: startMenu });
});
bot.callbackQuery("no", async (ctx) => {
	await ctx.msg.delete();
	await ctx.reply("Хорошо, давай попробуем сначала.");
	await ctx.conversation.enter("bookTable");
	ctx.answerCallbackQuery();
});
bot.callbackQuery("toAdminMenu", async (ctx) => {
	toAdminMenu(ctx);
	ctx.answerCallbackQuery();
});
bot.callbackQuery("toOwnerMenu", async (ctx) => {
	toOwnerMenu(ctx);
	ctx.answerCallbackQuery();
});
bot.callbackQuery("ok", async (ctx) => {
	ctx.answerCallbackQuery();
});
bot.callbackQuery("cancel", async (ctx) => {
	try {
		ctx.msg.delete();
	} catch (error) {}
	ctx.conversation.exit();
	ctx.answerCallbackQuery();
});
bot.callbackQuery("cancelBooking", async (ctx) => {
	try {
		// ctx.msg.delete();
	} catch (error) {}
	ctx.conversation.exit();
	ctx.answerCallbackQuery();
	await toMainMenu(ctx);
});
// bot.on(":photo", async (ctx) => {
// 	const file = await ctx.getFile(); // valid for at least 1 hour
//   const path = file.file_path; // file path on Bot API server
//   await ctx.reply(`https://api.telegram.org/file/bot${process.env.TOKEN}/${path}`);
// })

bot.on(":text", async (ctx) => {
	const text = ctx.msg.text;
	switch (text) {
		case await getAdminPassword():
			await adminHandler(ctx);
			break;
		case await getOwnerPassword():
			await ownerHandler(ctx);
			break;
		default:
			await AIHandler(ctx);
			break;
	}
});

bot.on(":file", async (ctx) => {
});

bot.callbackQuery(/-/, async (ctx) => {
	// Взаимодействие с категориями
	// try {
	// 	await ctx.msg.delete();
	// } catch (error) {}

	const { preference, action } = toPref(ctx);
	switch (action) {
		case "pref":
			try {
				votePollHandler(ctx, preference);
			} catch (error) {}
			break;
		case "question":
			ctx.session.userId = preference;
			await questionHandler(ctx);
			break;
		default:
			break;
	}
	ctx.answerCallbackQuery();
});

bot.catch((error) => {
	console.error(error);
	bot.start();
});
bot.start();
