import { toMainMenuKeyboard } from "../keyboards/toMainMenuKeyboard.js";
// import { loader } from "../loaders.js";
import { clearMessageHistory, getAnswer, newThread } from "../services.js";
import { v4 as uuidv4 } from "uuid";

const handleOrder = async (ctx, order) => {
	console.log(order);
	const foodInfo = order.menuItems
		.map((item) => {
			return `${item.name}: ${item.amount} шт.\n`;
		})
		.join("");
	const allergyInfo = `${
		order.hasAllergy
			? "Аллергия на: " + `${order.allergy.join(", ")}`
			: "Аллергии нет"
	}
	`;
	const text = `<b>Заказ на самовывоз:</b>
${foodInfo}
${allergyInfo}
Время забора: ${order.timeToPickUpTheOrder}
Номер телефона: ${order.phoneNumber}
Способ оплаты: ${order.paymentMethod}
Количество столовых приборов: ${order.cutlery}

Телеграм пользователя: @${ctx.from.username}
`;

	let sum = order.menuItems.map((item) => item.amount * item.price);
	console.log(sum);
	sum = sum.reduce((accumulator, curValue) => accumulator + curValue, 0);

	await newThread(ctx);
	console.log(text);
	await ctx.api.sendMessage(762569950, text);
	await ctx.reply(
		`Сумма к оплате с учетом скидки 15% составит ${
			sum * 0.85
		} рублей. Ждем Вас в ресторане Марико!`,
		{
			reply_markup: toMainMenuKeyboard(),
		}
	);
};

export const AIHandler = async (ctx) => {
	if (ctx.session.toChat) {
		const typing = setInterval(async () => {
			ctx.api.sendChatAction(ctx.from.id, "typing");
		}, 1500);
		const thread = ctx.session.thread_id;
		if (ctx.msg.text === "!!") {
			await clearMessageHistory(thread);
			return await ctx.reply("История очищена");
		}
		try {
			const { answer, order, photo } = await getAnswer(ctx.msg.text, thread);
			console.log(answer);
			console.log(photo);
			if (photo) {
				await ctx.api.sendPhoto(ctx.from.id, photo, { caption: answer });
			} else {
				await ctx.reply(answer);
			}
			clearInterval(typing)
			order?.isCompleted ? await handleOrder(ctx, order) : null;
		} catch (error) {
			console.error(error);
			await ctx.api.sendMessage(762569950, error.message);
			const err = error.description;
			if (err === "Bad Request: wrong file identifier/HTTP URL specified") {
				await ctx.reply(
					"Сейчас Телеграм не позволяет мне отправить фото, повторите попытку позже. Чем Вы хотите дополнить свой заказ?"
				);
				await ctx.reply(answer);
			} else {
				await ctx.reply(
					"Извините, не совсем поняла Вас. Можете, пожалуйста, повторить?"
				);
			}
		}
	}
};
