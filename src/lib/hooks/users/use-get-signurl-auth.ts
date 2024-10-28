import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

// type ResponseType = InferResponseType<
// (typeof client.api.user)["is-premium"]["$get"]
// >

// type RequestType = InferResponseType<
// (typeof client.api.user)["is-premium"]["$get"]
// >

export const useSignedUrl = (iFrameURL : string) => {
    const query = useQuery({
        queryKey : ["signedUrl"],
        queryFn : async() => {
            const response = await client.api.video["get-signed-url"]["$get"]();
            query : {
                iFrameURL : ""
            }
            if(!response.ok){
                throw new Error(response.statusText);
            }

            const data = await response.json();
            return data.data;
        }
    });

    return query;
}