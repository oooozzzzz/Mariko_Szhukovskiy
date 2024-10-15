import { toMainMenuKeyboard } from "../keyboards/toMainMenuKeyboard.js";
import { loader } from "../loaders.js";
import { getAnswer, newThread } from "../services.js";
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
	const text = `Заказ:
${foodInfo}
${allergyInfo}
Время забора: ${order.timeToPickUpTheOrder}
Номер телефона: ${order.phoneNumber}
Способ оплаты: ${order.paymentMethod}
Количество столовых приборов: ${order.cutlery}
`;
	newThread(ctx);
	console.log(text);
	await ctx.reply(
		`Сумма к оплате с учетом скидки 15% составит ${
			order.sum * 0.85
		} рублей. Ждем Вас в ресторане Марико!`,
		{
			reply_markup: toMainMenuKeyboard(),
		}
	);
};

export const AIHandler = async (ctx) => {
	if (ctx.session.toChat) {
		await ctx.api.sendChatAction(ctx.from.id, "typing");
		const thread = ctx.session.thread_id;
		const { answer, order } = await getAnswer(ctx.msg.text, thread);
		console.log(answer);
		await ctx.reply(answer);
		order?.isCompleted ? await handleOrder(ctx, order) : null;
	}
};
