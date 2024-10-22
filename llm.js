import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
dotenv.config();

export const llm = new ChatOpenAI({
	configuration: { baseURL: "https://api.proxyapi.ru/openai/v1/" },
	model: "gpt-4o-mini",
	temperature: 0,
	// topP: 0.6
	// topLogprobs: 2,
	// logprobs: true
	// topP: 0.2,


});
