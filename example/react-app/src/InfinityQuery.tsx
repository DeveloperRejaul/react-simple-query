import { useQuery } from 'react-simple-query'

type Post = {
    "userId": number,
    "id": number,
    "title":string,
    "body": string
};

let page = 1
export default function InfinityQuery() {

   const {data, req} = useQuery<{id:number, name:string}[], void, void, Post[]>(`/posts?_page=${page}&_limit=5`, {
    transformResponse(data) {
        return data.map((d) =>({id: d.id, name: d.title}) )
    },
    updateQueryData(prevusData, curentData) {
        return [...(prevusData || []), ...curentData]
    },
   })

   const handleMore = () => {
        page +=1
        req(`/posts?_page=${page}&_limit=5`)
    }

  return (
    <div>
        <div 
        onClick={handleMore}
        >more</div>
        {data?.map(d=> (<div>
            <span>{d.id}: </span>
            <span>{d.name}</span>
        </div>))}
    </div>
  )
}
