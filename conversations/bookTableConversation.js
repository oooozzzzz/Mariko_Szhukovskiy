import { confirmBookingKeyboard } from "../keyboards/confirmBookingKeyboard.js";
import { numberOfPersonsKeyboard } from "../keyboards/numberOfPersonsKeyboard.js";
import { timePickKeyboard } from "../keyboards/timePickKeyboard.js";
import { toMainMenuKeyboard } from "../keyboards/toMainMenuKeyboard.js";

const ask = async (conversation, ctx, question, item) => {
	let markup;
	if (item == "time") {
		markup = timePickKeyboard;
	} else if (item === "guests") {
		markup = numberOfPersonsKeyboard;
	} else if (item === "wishes") {
		markup = { remove_keyboard: true };
	}
	await ctx.reply(question, { reply_markup: markup });
	const { message } = await conversation.wait();
	console.log(ctx.session);
	if (message?.text) {
		ctx.session[item] = message?.text;
		return message?.text;
	} else {
		return false;
	}
};

const makeOrder = async (conversation, ctx) => {
	const day = await ask(
		conversation,
		ctx,
		"Прекрасный выбор, Генацвале! Уточните дату посещения ресторана:",
		"day"
	);
	if (!day) {
		return ctx.reply("Операция отменена", {
			reply_markup: toMainMenuKeyboard(),
		});
	}
	const time = await ask(
		conversation,
		ctx,
		"Время, на которое бронируем стол:",
		"time"
	);
	if (!time) {
		return ctx.reply("Операция отменена", {
			reply_markup: toMainMenuKeyboard(),
		});
	}
	const guests = await ask(
		conversation,
		ctx,
		"Сколько гостей ожидаем?",
		"guests"
	);
	if (guests === "6 и более") {
		await ctx.reply(`Дорогой, для такой большой компании рекомендуем сделать предзаказ в ресторане.
			
*при бронировании от 8-ми человек депозит 3500р/на гостя, вы можете прийти со своим алкоголем, также необходима предоплата 30% от счета наличными. 
**мы включаем сервисный сбор 10% от счета при обслуживании больших компаний от 8-ми гостей.`);
	}
	if (!guests) {
		return ctx.reply("Операция отменена", {
			reply_markup: toMainMenuKeyboard(),
		});
	}
	const wishes = await ask(
		conversation,
		ctx,
		"Есть ли у вас особые пожелания по размещению или обслуживанию?",
		"wishes"
	);
	if (!wishes) {
		return ctx.reply("Операция отменена", {
			reply_markup: toMainMenuKeyboard(),
		});
	}


	await ctx.reply(
		`Итак, вот детали Вашего бронирования:
День бронирования: ${ctx.session.day}
Время бронирования: ${ctx.session.time}
Количество гостей: ${ctx.session.guests}
Особые пожелания: ${ctx.session.wishes}
Все верно?
`,
		{ reply_markup: confirmBookingKeyboard }
	);
};
export const bookTable = async (conversation, ctx) => {
	await makeOrder(conversation, ctx);
};
