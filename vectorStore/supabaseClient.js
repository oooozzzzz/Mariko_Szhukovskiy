import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const sbUrl = process.env.SUPABASE_URL_LC_CHATBOT;
const sbApiKey = process.env.SUPABASE_API_KEY;

export const client = createClient(sbUrl, sbApiKey);
