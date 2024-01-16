import { EMessageName } from "infrastructure_common";
import { Socket } from "socket.io";
import { TextProcessor } from "./TextProcessor";

export class SocketController {
  constructor(
    protected textProcessor: TextProcessor
  ) {}

  public async handleConnection(socket: Socket) {
    setInterval(() => {
      const state = this.textProcessor.snapShotState({ socket })
      socket.emit(EMessageName.TEXT_STATE, state)
    }, 1000);
  }
}