export type TPlainTextInitState = {
  plainText: string;
}

export class ServerAdapter {
  public static readonly HOST = 'http://10.0.54.194:3001';//'http://localhost:3001';

  public static async fetchPlainTextIinitState(): Promise<TPlainTextInitState> {
    const response = await fetch(`${ServerAdapter.HOST}/api/plain-text`);
    const result =  await response.json();
    if('string' !== typeof result.plainText) {
      throw new Error('Invalid response from server', result);
    }
    return result;
  }
}