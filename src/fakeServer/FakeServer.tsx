import { Breakpoint } from "../types";

type DBFields = {
  temperature: number;
  breakpoints: Breakpoint[];
};

class DB {
  static instance = new DB();
  private db: DBFields = {
    temperature: 25,
    breakpoints: [
      { degree: 25, id: "break:25" },
      { degree: 15, id: "break:15" },
      { degree: 35, id: "break:35" },
    ],
  };

  public get<TField extends keyof DBFields>(param: TField) {
    return this.db[param];
  }

  public put<TField extends keyof DBFields>(
    param: TField,
    value: DBFields[TField]
  ) {
    if (param === "temperature" && value < 10) {
      throw new Error("Incorrect user input");
    }

    this.db[param] = value;
    return this.db[param];
  }

  public delete(param: "breakpoints", id: string) {
    this.db[param] = this.db[param].filter((bp) => bp.id !== id);

    return this.db[param];
  }

  public post(param: "breakpoints", nextBreakpoint: Breakpoint) {
    if (this.db[param].find((bp) => bp.id === nextBreakpoint.id)) {
      return this.db[param];
    }

    this.db[param].push(nextBreakpoint);
    return this.db[param];
  }
}

class FakeServer {
  private requestDelay: number = 0;
  private db = DB.instance;

  constructor(requestDelay?: number) {
    this.requestDelay = requestDelay || 0;
  }

  private request = async () => {
    await sleep(this.requestDelay);

    return this.db;
  };

  public async get<TField extends keyof DBFields>(param: TField) {
    const db = await this.request();
    const result = db.get<typeof param>(param);

    console.log("get request ready ", param, result);
    return result;
  }

  public async put<TField extends keyof DBFields>(
    param: TField,
    value: DBFields[TField]
  ) {
    const db = await this.request();
    const result = db.put(param, value);

    console.log("put request ready ", result);
    return result;
  }

  public async post(param: "breakpoints", nextBreakpoint: Breakpoint) {
    const db = await this.request();
    const result = db.post(param, nextBreakpoint);

    console.log("post request ready ", result);
    return result;
  }

  public async delete(param: "breakpoints", id: string) {
    const db = await this.request();
    const result = db.delete(param, id);

    console.log("delete request ready ", result);
    return result;
  }
}

export const fastServer = new FakeServer();
export const longServer = new FakeServer(3000);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
