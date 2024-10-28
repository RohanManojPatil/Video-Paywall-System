import { client } from "@/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

// Define ResponseType and explicitly define RequestType
type ResponseType = InferResponseType<
  (typeof client.api.payments)["verify-payment"]["$post"], 
  200
>;

type RequestType = {
  signature: string;
  orderId: string;
  paymentId: string;
};

export const useVerifyPayment = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.payments["verify-payment"].$post({ json });

      if (!response.ok) {
        const errorMessage = await response.json().catch(() => response.statusText);
        throw new Error(errorMessage || "Failed to verify payment");
      }

      const data = await response.json();
      return data;
    },
    onError: (error) => {
      toast.error(`Payment Not Verified: ${error.message}`);
    },
    onSuccess: () => {
      toast.success("Payment Verified Successfully");
    },
  });

  return mutation;
};
