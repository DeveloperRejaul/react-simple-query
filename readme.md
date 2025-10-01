# 📦 react-simple-query

A lightweight, **zero-dependency** React query library for simple data fetching, caching, and request state management.
Built with hooks + context, it's designed to give you an easy alternative to complex query libraries like React Query.

---

## ✨ Features

* 🔥 **Simple API** – fetch data with one hook
* ⚡ **Built-in caching** with timeout control
* 🎯 **Request state management** (`isLoading`, `isFetching`, `isSuccess`, `isError`)
* ⏱️ **Request timeout handling**
* 🌐 **Configurable base URL**
* 🧩 **Flexible configuration options**
* 💡 **TypeScript support**
* 🔄 **Client and Server-side rendering support**ple-query

---

## 📦 Installation

```bash
npm install react-simple-query
# or
yarn add react-simple-query
```

---

## 🚀 Getting Started

Wrap your app with `QueryProvider`:

```tsx
"use client";

import { QueryProvider } from "react-simple-query";

export default function App({ children }) {
  return (
    <QueryProvider config={{ cash: true, baseUrl:"https://api.example.com" }}>
      {children}
    </QueryProvider>
  );
}
```

Then use the `useQuery` hook anywhere:

```tsx
"use client";

import { useQuery } from "react-simple-query";

export default function Users() {
  const { data, isLoading, isError, error } = useQuery(`/api/users`);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  return (
    <ul>
      {data?.map((user: any) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## 🛠 API Reference

### 🔹 `QueryProvider`

Provider component that makes query state and cache available throughout the app.

```tsx
<QueryProvider config={{
  baseUrl: 'https://api.example.com',
  cash: true,
  cashTimeout: 30000,
  requestTimeout: 30000
}}>
  <App />
</QueryProvider>
```

#### Props:

| Prop     | Type         | Default | Description          |
| -------- | ------------ | ------- | -------------------- |
| `config` | `ConfigType` | See below | Configuration object |

**ConfigType**

```ts
interface ConfigType {
  baseUrl: string;        // Base URL for all requests
  cash?: boolean;         // Enable/disable caching (default: true)
  cashTimeout?: number;   // Cache timeout in ms (default: 30000)
  requestTimeout?: number; // Request timeout in ms (default: 30000)
}
```

---

### 🔹 `useQuery<T = any>(url?: string, params?: ReqParamsTypes)`

Hook for fetching data with automatic caching and state management.

```tsx
const {
  data,       // Response data of type T
  isLoading,  // Initial loading state
  isFetching, // Subsequent request loading state
  isSuccess,  // Request success state
  isError,    // Request error state
  error,      // Error object if request fails
  req         // Function to manually trigger request
} = useQuery('/api/users', {
  useCash: true,
  cashTimeout: 30000,
  requestTimeout: 30000
});
```

#### Parameters:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `url` | `string` | The endpoint URL (will be appended to baseUrl if provided) |
| `params` | `ReqParamsTypes` | Request configuration options |

**ReqParamsTypes**

```ts
interface ReqParamsTypes {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Headers;
  useCash?: boolean;        // Override provider cache setting
  cashTimeout?: number;     // Override provider cache timeout
  requestTimeout?: number;  // Override provider request timeout
  cashId?: string;         // Custom cache key
}
```

### 🔹 `useMutation<T = any>(params?: ReqParamsTypes)`

Hook for handling mutations (POST, PUT, DELETE operations).

```tsx
const { 
  req, 
  isLoading, 
  data 
} = useMutation();

const handleSubmit = () => {
  req("/api/posts", {
    method: 'POST',
    body: JSON.stringify({
      title: 'foo',
      body: 'bar'
    })
  });
};
```

### 🔹 Cache Utilities

The library provides helper functions for cache management:

```tsx
import { clearCash } from 'react-simple-query';

// Clear all cached data
clearCash();
```

Additional helper functions available through the `helper` object:
- `addCash(id: string, data: any)`
- `getCash(): Map<string, any>`
- `getCashByUrl(url: string)`
- `updateCashByUrl(url: string, data: any)`

Hook for fetching and managing async data.

#### Example:

```tsx
const { data, isLoading, isFetching, isSuccess, isError, error, req } =
  useQuery<User[]>(`${BASE_URL}/api/users`, {
    method: "GET",
    headers: new Headers({ Authorization: "Bearer token" }),
  });
```

#### Returns:

| Key          | Type                                                      | Description                     |
| ------------ | --------------------------------------------------------- | ------------------------------- |
| `data`       | `T \| null`                                               | The response data               |
| `isLoading`  | `boolean`                                                 | Request is initializing/loading |
| `isFetching` | `boolean`                                                 | Request is actively fetching    |
| `isSuccess`  | `boolean`                                                 | Request completed successfully  |
| `isError`    | `boolean`                                                 | Request failed                  |
| `error`      | `any`                                                     | Error object if request failed  |
| `req`        | `(url: string, params?: ReqParamsTypes) => Promise<void>` | Manual trigger function         |

#### Parameters:

```ts
interface ReqParamsTypes {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Headers;
}
```

---

## 🔄 Caching

When `cash` is enabled in the `QueryProvider`:

* Results are stored in memory (`Map`)
* Subsequent queries to the same URL will return cached data instantly
* Use `req(url)` to refetch and update the cache

---

## 📖 Example: Manual Refetch

```tsx
const { data, isFetching, req } = useQuery(`/api/posts`);

return (
  <div>
    <button onClick={() => req(`/api/posts`)}>
      {isFetching ? "Refreshing..." : "Refresh"}
    </button>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
);
```

---

## 🧩 Roadmap

* ✅ Initial release
* ⏳ Cache invalidation support
* ⏳ Mutation hooks (`useMutation`)
* ⏳ Global error handling

---

## 📜 License

MIT License © 2025

---