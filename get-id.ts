import somtoday from "somtoday.js";
import dotenv from 'dotenv';

dotenv.config();
declare global {
  namespace NodeJS {
    interface ProcessEnv {
			SCHOOL: string; 
			USERNAME: string;
			PASSWORD: string;
			ID: string;
		}
  }
}


async function main() {
  const org = await somtoday.searchOrganisation({
    name: process.env.SCHOOL,
  });
  if (!org) throw new Error("School not found");
  const user = await org.authenticate({
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  });
	const students = await user.getStudents();
	console.log("Add this to your .env file: ID=" + students[0].id)
}
main();
