const BASE_API_URL: string = "https://api.rahtash-tms.ir";

interface RequestOptions {
  method: string;
  url: string;
  query?: Record<string, any>;
  body?: any; // This can be any type (JSON or FormData)
  headers?: Record<string, string>;
}

interface Response {
  ok: boolean;
  status: number;
  json: () => Promise<any>;
}

export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  body: {
    total_results: number;
    per_page: number;
    page_now: number;
    next_link: string;
    status: true;
    message: string;
    data: T;
  };
}

export default class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = BASE_API_URL;
  }

  async request<T = any>(options: RequestOptions): Promise<ApiResponse<T>> {
    let query: string = new URLSearchParams(options.query || {}).toString();
    if (query !== "") {
      query = "?" + query;
    }

    let response: Response;
    try {
      const headers: Record<string, string> = {
        // Default headers for every request
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        ...options.headers,
      };

      // Check if the body is FormData to set headers accordingly
      if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(options.body);
      }

      response = await fetch(this.baseUrl + options.url + query, {
        method: options.method,
        headers,
        body: options.body || null,
      });
    } catch (error) {
      console.log(options);
      response = {
        ok: false,
        status: 500,
        json: async () => {
          return {
            code: 500,
            message: "The server is unresponsive",
            description: error.toString(),
          };
        },
      };
    }

    return {
      ok: response.ok,
      status: response.status,
      body: response.status !== 204 ? await response.json() : null,
    };
  }

  async get<T = any>(
    url: string,
    query?: Record<string, any>,
    options?: RequestOptions,
  ): Promise<ApiResponse> {
    return this.request<T>({ method: "GET", url, query, ...options });
  }

  async post(url: string, body: any, options?: RequestOptions): Promise<ApiResponse> {
    return this.request({ method: "POST", url, body, ...options });
  }

  async patch(url: string, body: any, options?: RequestOptions): Promise<ApiResponse> {
    return this.request({ method: "PATCH", url, body, ...options });
  }

  async delete(url: string, options?: RequestOptions): Promise<ApiResponse> {
    return this.request({ method: "DELETE", url, ...options });
  }

  // Add additional methods if necessary.
}
