import { HumanMessage } from "@langchain/core/messages";
import * as XLSX from "xlsx/xlsx.mjs";
import { agent, parser } from "./agent.js";
import * as fs from "fs";
import http from "http";
import { getAllUsers } from "./db.js";
import https from "https";
import { Readable } from "stream";
import { readFileSync } from "fs";
import { read } from "xlsx/xlsx.mjs";
import dotenv from "dotenv";
import { toAdminMenuKeyboard } from "./keyboards/toAdminMenuKeyboard.js";
import { v4 as uuidv4 } from "uuid";
dotenv.config();
XLSX.set_fs(fs);
XLSX.stream.set_readable(Readable);

export function combineDocuments(docs) {
	return docs.map((doc) => doc.pageContent).join("\n\n");
}

export const getAnswer = async (input, thread_id) => {
	console.log(input);
	const config = { configurable: { thread_id: thread_id } };
	try {
		const agentFinalState = await agent.invoke(
			{ messages: [new HumanMessage(input)] },
			config
		);

		const response =
			agentFinalState.messages[agentFinalState.messages.length - 1];
		const output = await parser.invoke(response);
		return output;
	} catch (error) {
		console.log(error);
	}
};

export const convertFileToCSV = async (inputFilename, outputFilename) => {
	const buf = readFileSync(inputFilename);
	const workbook = read(buf);
	const ws = workbook.Sheets[workbook.SheetNames[0]];

	const csv = XLSX.utils.sheet_to_csv(ws, {
		// FS: ",",
		// RS: ";",
	});
	// console.log(csv);

	fs.writeFile(
		"./menu.csv",
		csv,
		(err) => {}
		// { bookType: "csv",}
	);
	console.log("CSV file created successfully");
};

export const downloadFile = (url, file) => {
	return new Promise((resolve, reject) => {
		let localFile = fs.createWriteStream(file);
		const client = url.startsWith("https") ? https : http;
		client.get(url, (response) => {
			response.on("end", () => {
				console.log("Download of the record is complete");
				resolve(file);
			});
			response.pipe(localFile);
		});
	});
};

export const getFileLink = async (ctx) => {
	const file = await ctx.getFile(); // valid for at least 1 hour
	const path = file.file_path;
	return `https://api.telegram.org/file/bot${process.env.TOKEN}/${path}`;
};

export const deleteFile = async (path) => {
	fs.unlinkSync(path);
};

export const copyMessageToUsers = async (ctx) => {
	const usersList = await getAllUsers();
	function delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
	const send = async (id) => {
		await delay(500);
		try {
			await ctx.message.copy(id);
			return true;
		} catch (error) {
			return false;
		}
	};

	const processUsersList = async (usersList) => {
		let success = 0;
		let failure = 0;
		let atAll = 0;
		for (let user in usersList) {
			const res = await send(usersList[user].tg_id);
			res ? success++ : failure++;
			atAll++;
		}
		return { success, failure, atAll };
	};
	const { success, failure, atAll } = await processUsersList(usersList);
	await ctx.reply(
		`Всего отправлено сообщений пользователям: ${atAll}
Успешно: ${success}, с ошибками: ${failure}.`,
		{ reply_markup: toAdminMenuKeyboard }
	);
};

export const newThread = (ctx) => {
	ctx.session.thread_id = uuidv4();
};

export const toPref = (ctx) => {
	const query = ctx.callbackQuery.data;
	const index = query.match(/-/).index;
	const preference = query.slice(index + 1);
	const action = query.slice(0, index);
	return { preference, action };
};
