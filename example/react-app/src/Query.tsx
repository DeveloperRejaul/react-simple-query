import { useQuery,clearCash} from "react-simple-query";

interface ResponseType {
  id:string;
  name:string
}

export default function Query() {
    const { data, isLoading, isError, error, req } = useQuery<ResponseType[]>(`/users`, {
      useCash: true,
      cashTimeout: 30000,
      onSuccess(data) {
        console.log("onSuccess", data);
      },
      transformResponse(data) {
        return data.map(d=> ({...d}))
      },
      onError(error) {
        console.log(error);
      },
      transformError(error) {
        return {error: error.message}
      },
      transformHeader(data) {
        data.set("Authorization", "Bearer token")
        return data
      },
    });
    
    // console.log("data", data);
    // console.log("isLoading", isLoading);

    
    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error: {error?.message}</p>;
    

  return (
    <div>
        <div onClick={() => clearCash()}>clearCash</div>
      <div onClick={() => req(`/users`)}>fetch again</div>
      <ul>
        {data?.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}
