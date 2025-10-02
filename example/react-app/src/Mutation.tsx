import {useMutation} from 'react-simple-query'

export default function Mutation() {
    const {req, isLoading, data} = useMutation()

  console.log("isLoading", isLoading);
  console.log("data", data);
  

  const handleMutation = () => {
    req("/posts", {
        method: 'POST',
        body: JSON.stringify({
          title: 'foo',
          body: 'bar',
          userId: 1,
        }),
    })
  }


  return (
    <div onClick={handleMutation}>Mutation</div>
  )
}
