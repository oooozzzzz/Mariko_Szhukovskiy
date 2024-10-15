import { tableHandler } from "../handlers/tableHandler.js";
import { cancelKeyboard } from "../keyboards/cancelKeyboard.js";

export const answerQuestion = async (conversation, ctx) => {
	const beginning = await ctx.reply(
		"Пришлите файл с расширением .xlsx",
		{
			reply_markup: cancelKeyboard,
		}
	);
	const answerCtx = await conversation.wait();
	const answer = answerCtx.message?.text;
	if (!answer) {
		answerCtx.msg.delete();
		return ctx.reply("Операция отменена");
	}
	await ctx.api.deleteMessage(beginning.chat.id, beginning.message_id)
	// await ctx.api.sendMessage(ctx.session.userId, `Ответ от администратора: @${answerCtx.from.username}\n\n${answer}`);
	await tableHandler(ctx)
	// await ctx.reply("Ваш ответ передан пользователю!");
};

