import { Menu, MenuRange } from "@grammyjs/menu";
import { getAnswer } from "../services.js";
import { discountItem, discountsMenu } from "./discountsMenu.js";

export const startMenu = new Menu("startMenu")
	.text(
		(ctx) => ctx.t("book_table"),
		async (ctx) => {
			ctx.session.toChat = false;
			await ctx.conversation.enter("bookTable")
		}
	)
	.row()
	.text(
		(ctx) => ctx.t("takeaway_order"),
		async (ctx) => {
			try {
				ctx.session.toChat = true;
				await ctx.api.sendChatAction(ctx.from.id, "typing");
				const { answer } = await getAnswer("Привет", ctx.session.thread_id);
				await ctx.reply(answer);
			} catch (error) {
				console.error(error);
			}
		}
	)
	.row()
	.text(
		(ctx) => ctx.t("discounts"),
		async (ctx) => {
			ctx.session.toChat = false;
			ctx.menu.nav("discountsMenu")
			await ctx.msg.editText(ctx.t("discounts_menu"))
		}
	)
	.row()
	.text(
		(ctx) => ctx.t("contact_us"),
		async (ctx) => {
			ctx.session.toChat = false;
			try {
				await ctx.conversation.enter("askQuestion");
			} catch (error) {
				console.error(error);
			}
		}
	);

startMenu.register([discountsMenu, discountItem]);
