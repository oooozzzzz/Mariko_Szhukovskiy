import { tableHandler } from "../handlers/tableHandler.js";
import { cancelKeyboard } from "../keyboards/cancelKeyboard.js";
import { toAdminMenuKeyboard } from "../keyboards/toAdminMenuKeyboard.js";

export const setMenuConversation = async (conversation, ctx) => {
	const beginning = await ctx.reply("Пришлите файл с расширением .xlsx", {
		reply_markup: cancelKeyboard,
	});
	const answerCtx = await conversation.wait();
	const answer = answerCtx.message?.document;
	if (!answer) {
		try {
			await ctx.api.deleteMessage(beginning.chat.id, beginning.message_id);
			answerCtx.msg.delete();
		} catch (error) {}
		return ctx.reply("Операция отменена", {
			reply_markup: toAdminMenuKeyboard,
		});
	}
	await ctx.api.deleteMessage(beginning.chat.id, beginning.message_id);
	// await ctx.api.sendMessage(ctx.session.userId, `Ответ от администратора: @${answerCtx.from.username}\n\n${answer}`);
	await tableHandler(answerCtx);
	// await ctx.reply("Ваш ответ передан пользователю!");
};
