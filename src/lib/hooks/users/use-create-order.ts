import { client } from "@/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

// Define the expected response and request types more explicitly
type ResponseType = InferResponseType<
  (typeof client.api.payments)["create-order"]["$post"], 
  200
>;

type RequestType = {
  planId: string; // Explicitly define the expected request properties here
};

export const useCreateOrder = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.payments["create-order"].$post({ json });

      if (!response.ok) {
        // Attempt to read error message from response body if available
        const errorMessage = await response.json().catch(() => response.statusText || "Failed to create order");
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    },
    onError: (error) => {
      toast.error(`Error creating order: ${error.message}`);
    },
    onSuccess: () => {
      toast.success("Order Created Successfully");
    },
  });

  return mutation;
};
