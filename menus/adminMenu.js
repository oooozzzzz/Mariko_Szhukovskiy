import { Menu } from "@grammyjs/menu";

export const adminMenu = new Menu("adminMenu")
	.text("Оповестить пользователей", async (ctx) => {
		ctx.msg.delete();
		await ctx.conversation.enter("notifyUsers");
	})
	.row()
	.text("Установить меню", async (ctx) => {})
	.row()
	.text("Закрыть", async (ctx) => {
		ctx.msg.delete();
	});
// .text("Добавить опрос", async (ctx) => {
// 	ctx.msg.delete()
// 	await ctx.conversation.enter("createPoll")
// })
// .row()
// .text("Добавить ссылку на свой магазин", async (ctx) => {
// 	ctx.msg.delete();
// 	await ctx.conversation.enter("setShopUrl");
// });
