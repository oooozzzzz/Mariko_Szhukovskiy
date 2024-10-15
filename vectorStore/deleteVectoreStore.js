import { client } from "./supabaseClient.js";

export const deleteTable = async (tableName) => {
	const { error } = await client.from(tableName).delete().gt("id", 0);
	if (error) {
		console.log(`Failed to delete table "${tableName}": ${error.message}`);
	} else console.log(`Table "${tableName}" has been deleted`);
};
