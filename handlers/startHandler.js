import { createUser } from "../db.js";
import { startMenu } from "../menus/startMenu.js";
import { newThread } from "../services.js";

export const startHandler = async (ctx) => {
	await ctx.msg.delete();
	await newThread(ctx)
	if (ctx.session.toChat) {
		await ctx.reply("Хорошо, отменяем заказ. Если будут какие-то вопросы, обязательно задавайте!")
	}
	ctx.session.toChat = false
	await createUser(ctx.from.id, ctx.from.first_name);
	console.log(ctx.session);
	await ctx.reply(ctx.t("start"), { reply_markup: startMenu });
};
