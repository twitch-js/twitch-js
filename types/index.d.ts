// TypeScript Version: 2.3

import { ChatOptions, Chat } from "./Chat";
import * as ChatConstants from "./Chat/constants";
import { ApiOptions, Api } from "./Api";

export interface TwitchJsOptions {
  token: string;
  username: string;
  chat?: ChatOptions;
  api?: ApiOptions;
}

export class TwitchJs {
  chat: Chat;
  chatContants: typeof ChatConstants;
  api: Api;

  constructor(opts: TwitchJsOptions);
}
