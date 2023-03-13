type DBFields = "temperature";

class DB {
  static instance = new DB();
  private db: Record<DBFields, number> = { temperature: 25 };

  public get(param: DBFields) {
    return this.db[param];
  }

  public put(param: DBFields, value: number) {
    this.db[param] = value;
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

  public async get(param: DBFields) {
    console.log("get request accepted");

    const db = await this.request();
    const result = db.get(param);

    console.log("get request ready ", result);
    return result;
  }

  public async put(param: DBFields, value: number) {
    console.log("put request accepted");

    const db = await this.request();
    const result = db.put(param, value);

    console.log("put request ready ", result);
    return result;
  }
}

export const fastServer = new FakeServer();
export const longServer = new FakeServer(3000);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
