import { io, Socket } from 'socket.io-client';

export type TPlainTextInitState = {
  plainText: string;
}

export class ServerAdapter {
  public static readonly HOST = 'http://localhost:3001';
  public static readonly SOCKET_HOST = 'ws://localhost:3002';

  public static async fetchPlainTextIinitState(): Promise<TPlainTextInitState> {
    const response = await fetch(`${ServerAdapter.HOST}/api/plain-text`);
    const result = await response.json();
    if ('string' !== typeof result.plainText) {
      throw new Error('Invalid response from server', result);
    }
    return result;
  }

  public static socketConnect(): Socket {
    return io(ServerAdapter.SOCKET_HOST);
  }
}