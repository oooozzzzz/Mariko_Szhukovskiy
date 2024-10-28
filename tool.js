import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { retriever } from "./retriever.js";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { combineDocuments } from "./combineDocs.js";
import { RunnableSequence } from "@langchain/core/runnables";
import { llm } from "./llm.js";

export const getMenuInfo = tool(
	async (input) => {
		console.log(input.question);
		try {
			const response = await retriever(6).invoke(input.question);
			const rawInfo = combineDocuments(response);
			const prompt = PromptTemplate.fromTemplate(
				`Ты получил текст о блюдах из ресторана. Оставь в этом тексте только то, что касается {food}. Отвечай кратко только по делу. Без приветсвтий, прощаний и всего такого.
Текст: {text}`
			);
			const chain = prompt.pipe(llm).pipe(new StringOutputParser());
			const output = await chain.invoke({
				text: rawInfo,
				food: input.question,
			});
			console.log(output);
			return output;
		} catch (error) {
			console.log(error);
		}
	},
	{
		name: "get_menu_info",
		description:
			"Вызови для поиска информации о еде, если этой информации нет в истории сообщений.",
		schema: z.object({
			question: z
				.string()
				.describe(
					"Запрос, связанный с едой. Например: сладкое, напиток, салат, хачапури и тд"
				),
		}),
	}
);

export const getOrder = tool(
	async (input) => {
		console.log(input);
		// console.log(input.info);
		try {
			// const response = await retriever(1).invoke(input.food);
			// return combineDocuments(response);
			const prompt = PromptTemplate.fromTemplate(`
					Ты получила всю информацию о заказе. Сформируй карточку заказа, которая должна включать следующую информацию: еда, наличие аллергии, время к которому нужно приготовить заказ, на какое количество персон положить столовые приборы, способ оплаты, мой номер телефона.
Информация о заказе: {info}.
Карточка заказа:
				`);
			// const chain = prompt.pipe(llm).pipe(new StringOutputParser());

			// const output = await chain.invoke({ info: input.info });
			// console.log(output);
			const output = `${input.info}
Информация о цене: ${input.cost}`;
			console.log(output);
			return output;
		} catch (error) {
			console.log(error);
		}
	},
	{
		name: "get_order_info",
		description: "Вызови, чтобы сформировать карточку заказа",
		schema: z.object({
			info: z
				.string()
				.describe(
					"Вся информация о моем заказе, которую ты получила в ходе разговора, а также информация о стоимости каждого блюда"
				),
			cost: z
				.string()
				.describe(
					"Информация о стоимости каждого блюда из моего заказа. формат: название блюда - стоимость этого блюда(число). найди эту информацию с помощью инструментов"
				),
		}),
	}
);
