import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { loader } from "../loaders.js";
import { client } from "./supabaseClient.js";
import * as dotenv from "dotenv";
dotenv.config();

const embeddings = new OpenAIEmbeddings({
	configuration: { baseURL: "https://api.proxyapi.ru/openai/v1/" },
});

const menu = await loader.load();

export const createTable = async (name) => {
	console.log("creating new table...")
	try {
		await SupabaseVectorStore.fromDocuments(menu, embeddings, {
			client,
			tableName: "menu",
		});
		console.log("Vector store created successfully!");
	} catch (error) {
		console.error("Error creating vector store:", error);
	}
};
