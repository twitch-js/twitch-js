import { FetchOptions } from "types/utils/fetch";

export interface ApiOptions {
  clientId?: string;
  token?: string;
  urlRoot?: string;
  debug?: boolean;
}

export enum ReadyState {
  READY = 1,
  INITIALIZED = 2,
}

export interface ApiStatusState {
  token: {
    authorization: {
      scopes: string[];
      createdAt: string;
      updatedAt: string;
    };
    clientId: string;
    userId: string;
    userName: string;
    valid: boolean;
  };
}

export class Api {
  readyState: ReadyState;
  status: ApiStatusState;
  options: ApiOptions;
  headers: {
    Accept: "application/vnd.twitchtv.v5+json",
    "Client-ID": string|undefined,
    Authorization: string|undefined,
  };

  constructor(opts?: ApiOptions);

  /**
   * Initialize API client and retrieve status.
   */
  initialize(): Promise<ApiStatusState>;

  /**
   * Check if current credentials include `scope`.
   */
  hasScope(scope: string): Promise<boolean>;

  /**
   * GET endpoint.
   *
   * @example <caption>Get Live Overwatch Streams</caption>
   * api.get("streams", { search: { game: "Overwatch" } })
   *   .then(response => {
   *     // Do stuff with response ...
   *   })
   */
  get(endpoint: string, options?: FetchOptions): Promise<{}>;

  /**
   * POST endpoint.
   */
  post(endpoint: string, options?: FetchOptions): Promise<{}>;

  /**
   * PUT endpoint.
   */
  put(endpoint: string, options?: FetchOptions): Promise<{}>;
}
