/** 
 @service folder
 In this folder we give the third party integration like:-
 payment, llm call , ai [gemini api] call, storage 
  */

import imagekit, { toFile } from "@imagekit/nodejs";
import dotenv from "dotenv";
dotenv.config();

const client = new imagekit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export const uploadFile = async ({ buffer, fileName }) => {
  const result = await client.files.upload({
    file: await toFile(buffer),
    fileName: fileName,
  });
  console.log(result);
  return result;
};
