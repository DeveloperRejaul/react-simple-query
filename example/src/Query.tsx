import { useQuery,clearCash} from "react-simple-query";


export default function Query() {

    const { data, isLoading, isError, error, req } = useQuery(`/users`, {useCash: true,cashTimeout: 30000});
    
    console.log("data", data);
    console.log("isLoading", isLoading);

    
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
