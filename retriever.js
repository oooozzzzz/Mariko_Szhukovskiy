import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();


const sbApiKey = process.env.SUPABASE_API_KEY;
const sbUrl = process.env.SUPABASE_URL_LC_CHATBOT;

const client = createClient(sbUrl, sbApiKey);
const embeddings = new OpenAIEmbeddings({
	configuration: { baseURL: "https://api.proxyapi.ru/openai/v1/" },
});

const vectorStore = new SupabaseVectorStore(embeddings, {
	client,
	tableName: "menu",
	queryName: "match_menu",
});

const retriever = (n) => vectorStore.asRetriever({ k: n });

export { retriever, vectorStore };





	// const splitter = new RecursiveCharacterTextSplitter({
	// 	chunkSize: 500,
	// 	chunkOverlap: 50,
	// 	separators: ["\n\n", "\n", " ", ""], // default setting
	// });

	// const output = await splitter.createDocuments([text]);

		// await SupabaseVectorStore.fromDocuments(
	// 	output,
	// 	embeddings,
	// 	{
	// 		client,
	// 		tableName: "documents",
	// 	}
	// );