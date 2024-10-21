import {
	convertFileToCSV,
	deleteFile,
	downloadFile,
	getFileLink,
} from "../services.js";
import { createTable } from "../vectorStore/createVectorStore.js";
import { deleteTable } from "../vectorStore/deleteVectoreStore.js";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";

export const tableHandler = async (ctx) => {
	await ctx.reply("Обрабатываю запрос...");
	const url = await getFileLink(ctx);
	const path = await downloadFile(url, "newMenu.xlsx");
	path ? console.log("success") : console.log("error");
	convertFileToCSV(path, "./menu.csv");
	await deleteTable("menu");
	await ctx.reply("Объясняю меню боту...");
	const loader = new CSVLoader("./menu.csv");
	const menu = await loader.load();
	await createTable("menu", menu);
	deleteFile(path);
	await ctx.reply("Ваше меню было успешно установлено!");
};
