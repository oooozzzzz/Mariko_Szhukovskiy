import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
export const loader = new CSVLoader("./menu.csv");
