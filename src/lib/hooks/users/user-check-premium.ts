import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

// type ResponseType = InferResponseType<
// (typeof client.api.user)["is-premium"]["$get"]
// >

// type RequestType = InferResponseType<
// (typeof client.api.user)["is-premium"]["$get"]
// >

export const userCheckPremium = () => {
    const query = useQuery({
        queryKey : ["is-premium"],
        queryFn : async() => {
            const response = await client.api.user["is-premium"]["$get"]();

            if(!response.ok){
                throw new Error(response.statusText);
            }

            const data = await response.json();
            return data.isPremium;
        }
    });

    return query;
}