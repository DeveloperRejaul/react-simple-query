# 📦 react-simple-query

A lightweight, **zero-dependency** React query library for simple data fetching, caching, and request state management.
Built with hooks + context, it’s designed to give you an easy alternative to complex query libraries like React Query.

---

## ✨ Features

* 🔥 **Simple API** – fetch data with one hook
* ⚡ **Built-in caching** with `Map`
* 🎯 **Request state management** (`isLoading`, `isFetching`, `isSuccess`, `isError`)
* 🧩 **Configurable provider** with flexible options
* 💡 **Lightweight & framework-agnostic**

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
    <QueryProvider config={{ cash: true }}>
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
  const { data, isLoading, isError, error } = useQuery("/api/users");

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
<QueryProvider config={{ cash: true }}>
  <App />
</QueryProvider>
```

#### Props:

| Prop     | Type         | Default | Description          |
| -------- | ------------ | ------- | -------------------- |
| `config` | `ConfigType` | `{}`    | Configuration object |

**ConfigType**

```ts
interface ConfigType {
  cash?: boolean; // Enable/disable caching (default: true)
}
```

---

### 🔹 `useQuery<T = any>(url?: string, params?: ReqParamsTypes)`

Hook for fetching and managing async data.

#### Example:

```tsx
const { data, isLoading, isFetching, isSuccess, isError, error, req } =
  useQuery<User[]>("/api/users", {
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
const { data, isFetching, req } = useQuery("/api/posts");

return (
  <div>
    <button onClick={() => req("/api/posts")}>
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