import { ChatPromptTemplate } from "@langchain/core/prompts";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { retriever } from "./retriever.js";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { combineDocuments } from "./combineDocs.js";
import { RunnableSequence } from "@langchain/core/runnables";

export const getMenuInfo = tool(
	async (input) => {
		console.log(input.question)
		try {
			const response = await retriever.invoke(input.question);
			return combineDocuments(response);
		} catch (error) {
			console.log(error);
		}
	},
	{
		name: "get_menu_info",
		description: "Call to get information about menu, dishes or food",
		schema: z.object({
			question: z.string().describe("Блюдо, которое я упомянул"),
		}),
	}
);

export const getOrder = tool(
	async (input) => {
		console.log(input.order)
		const zodSchema = z.object({
			answer: z.string().describe("Ответ на мой вопрос"),
			order: z
				.object({
					menuItems: z
						.array(z.string())
						.describe("Позиции в меню, которые я заказал"),
					numberOfPersons: z
						.number()
						.describe("Количество людей, которым нужны столовые приборы"),
					timeToPickUpTheOrder: z
						.string()
						.describe("Время, в которое я заберу заказ"),
					paymnetMethod: z
						.enum(["Карта", "Наличные"])
						.describe("Платежный способ: карта или наличные"),
					hasAllergy: z
						.boolean()
						.describe("Есть ли у меня аллергия на какие либо продукты"),
					allergy: z
						.string()
						.array()
						.optional()
						.describe("На какие продукты у меня аллергия"),
					isCompleted: z
						.boolean()
						.describe(
							"Узнал ли ты все детали заказа или нет. Базовое значение этого поля false. Это поле должно стать true только после того, как ты узнаешь все детали о моем заказе. "
						),
				})
				.optional()
				.describe(
					"Мой заказ, детали которого ты должен выяснить в ходе беседы. Не может быть null"
				),
		});

		const parser = StructuredOutputParser.fromZodSchema(zodSchema);
		return input.order
	},
	{
		name: "get_order_info",
		description: "Call to get information about the order from chat history",
		schema: z.object({
			order: z.string().describe("Вся информация о заказе"),
		}),
	}
);
