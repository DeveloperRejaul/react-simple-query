import {useMutation} from 'react-simple-query'

export default function Mutation() {
    const {req} = useMutation({
      onError(error) {
        console.log("error",error);
      },
      onSuccess(data) {
        console.log("onSuccess", data);
      },
    })

  // console.log("isLoading", isLoading);
  // console.log("data", data);
  

  const handleMutation = () => {
    req("/posts", {
        method: 'POST',
        body: {
          title: 'foo',
          body: 'bar',
          userId: 1,
        },
      })
  }


  return (
    <div onClick={handleMutation}>Mutation</div>
  )
}
