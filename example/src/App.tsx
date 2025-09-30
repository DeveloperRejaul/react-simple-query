"use client";

import { useQuery } from "react-simple-query";
const BASE_URL = "https://jsonplaceholder.typicode.com"


export default function App() {
  const { data, isLoading, isError, error, req } = useQuery(`${BASE_URL}/users`);


  console.log("data", data);
  console.log("isLoading", isLoading);
  
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  return (
    <div>
      <div onClick={() => req(`${BASE_URL}/users`)}>fetch again</div>
      <ul>
        {data?.map((user: any) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>

  );
}