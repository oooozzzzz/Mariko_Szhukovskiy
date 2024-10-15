import {
	convertFileToCSV,
	deleteFile,
	downloadFile,
	getFileLink,
} from "../services.js";
import { createTable } from "../vectorStore/createVectorStore.js";
import { deleteTable } from "../vectorStore/deleteVectoreStore.js";

export const tableHandler = async (ctx) => {
	await ctx.reply("Обрабатываю запрос...");
	const url = await getFileLink(ctx);
	const path = await downloadFile(url, "newMenu.xlsx");
	path ? console.log("success") : console.log("error");
	convertFileToCSV(path, "menu.csv");
	await deleteTable('menu');
	await ctx.reply("Объясняю меню боту...")
	await createTable('menu');
	deleteFile(path);
	await ctx.reply("Ваше меню было успешно установлено!");
};
