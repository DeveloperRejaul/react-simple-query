import {useMutation} from 'react-simple-query'

export default function Mutation() {
    const {req} = useMutation<void, {title:string, body:string, userId:number}>({
      onError(error) {
        // console.log("error",error);
      },
      onSuccess(data) {
        // console.log("onSuccess", data);
      },
    })

  // console.log("isLoading", isLoading);
  // console.log("data", data);
  

  const handleMutation = () => {
    req("/posts", {
        method: 'POST',
        body: {
          title:"",
          body:"sadfa",
          userId:12,
        },
      })
  }


  return (
    <div onClick={handleMutation}>Mutation</div>
  )
}
