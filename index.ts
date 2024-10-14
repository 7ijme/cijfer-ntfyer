import axios from "axios";
import somtoday from "somtoday.js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SCHOOL: string;
      USERNAME: string;
      PASSWORD: string;
      ID: string;
			NTFY_URL: string;
			TOPIC: string;
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
  const token = user.accessToken;

  const cijfers: Cijfer[] = [];
  let i = 0;
  while (true) {
    // https://api.somtoday.nl/rest/v1
    // /rest/v1/resultaten/huidigVoorLeerling/[id]

    const res = await axios.get(
      `https://api.somtoday.nl/rest/v1/resultaten/huidigVoorLeerling/${process.env.ID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Range: `items=${i}-${i + 99}`,
          Accept: "application/json",
        },
        params: {
          additional: "cijferkolomId",
        },
      },
    );
    const data = res.data as Response;

    const filteredData = data.items.filter(
      (cijfer) => cijfer.type === "Toetskolom",
    );

    const mappedData: Cijfer[] = filteredData.map((cijfer) =>
      parseData(cijfer),
    );

    cijfers.push(...mappedData);

    i += 100;
    if (data.items.length < 100) break;
  }

  const oldData = fs.existsSync("cijfers.json") ? JSON.parse(
    fs.readFileSync("cijfers.json", "utf-8"),
  ) : [] as Cijfer[];

  for (const cijfer of cijfers) {
    const oldCijfer = oldData.find((oldCijfer) => oldCijfer.id === cijfer.id);
    if (!oldCijfer) {
      console.log(`Nieuw cijfer: ${cijfer.vak} - ${cijfer.cijfer}`);
      // ntfy post request
      await axios.post(
        process.env.NTFY_URL,
        {
          topic: process.env.TOPIC,
          message: `Je hebt een ${cijfer.cijfer} voor ${cijfer.naam}`,
        },
        {
          headers: {
            title: `Nieuw cijfer voor ${cijfer.vak}`,
          },
        },
      );
    } else if (oldCijfer.cijfer !== cijfer.cijfer) {
      console.log(`Gewijzigd cijfer: ${cijfer.vak} - ${cijfer.cijfer}`);
      // ntfy post request
      await axios.post(
        process.env.NTFY_URL,
        {
          topic: process.env.TOPIC,
          message: `Je cijfer is veranderd van ${oldCijfer.cijfer} naar ${cijfer.cijfer} voor ${cijfer.naam}`,
        },
        {
          headers: {
            Title: `Nieuw cijfer voor ${cijfer.vak}`,
          },
        },
      );
    }
  }

	if (cijfers === oldData) console.log("Geen nieuwe cijfers");

  fs.writeFileSync("cijfers.json", JSON.stringify(cijfers, null, 2));
}

main();

interface Cijfer {
  vak: string;
  cijfer: string;
  naam: string;
  datum: string;
  id: string;
}

function parseData(data: Item) {
  const cijfer: Cijfer = {
    vak: data.vak.afkorting,
    cijfer: data.resultaat || data.resultaatLabel || "-",
    naam: data.omschrijving || "-",
    datum: data.datumInvoer,
    id: data.links[0].id.toString(),
  };

  return cijfer;
}

export interface Response {
  items: Item[];
}

export interface Item {
  $type: string;
  links: Link[];
  permissions: Permission[];
  additionalObjects: AdditionalObjects;
  herkansingstype: string;
  datumInvoer: string;
  teltNietmee: boolean;
  toetsNietGemaakt: boolean;
  leerjaar: number;
  periode: number;
  isExamendossierResultaat: boolean;
  isVoortgangsdossierResultaat: boolean;
  type: string;
  vak: Vak;
  leerling: Leerling;
  vrijstelling: boolean;
  volgnummer?: number;
  resultaat?: string;
  geldendResultaat?: string;
  weging?: number;
  examenWeging?: number;
  omschrijving?: string;
  resultaatLabel?: string;
  resultaatLabelAfkorting?: string;
}

export interface Link {
  id: number;
  rel: string;
  type: string;
  href: string;
}

export interface Permission {
  full: string;
  type: string;
  operations: string[];
  instances: string[];
}

export interface AdditionalObjects {
  toetssoortnaam?: string;
}

export interface Vak {
  links: Link2[];
  permissions: Permission2[];
  additionalObjects: AdditionalObjects2;
  afkorting: string;
  naam: string;
  UUID: string;
}

export interface Link2 {
  id: number;
  rel: string;
  type: string;
  href: string;
}

export interface Permission2 {
  full: string;
  type: string;
  operations: string[];
  instances: string[];
}

export interface AdditionalObjects2 {}

export interface Leerling {
  links: Link3[];
  permissions: Permission3[];
  additionalObjects: AdditionalObjects3;
  UUID: string;
  leerlingnummer: number;
  roepnaam: string;
  voorvoegsel: string;
  achternaam: string;
}

export interface Link3 {
  id: number;
  rel: string;
  type: string;
  href: string;
}

export interface Permission3 {
  full: string;
  type: string;
  operations: string[];
  instances: string[];
}

export interface AdditionalObjects3 {}
