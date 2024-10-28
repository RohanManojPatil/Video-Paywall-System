import React, { useEffect } from 'react';
import { useCreateOrder } from '@/lib/hooks/users/use-create-order';
import { useVerifyPayment } from '@/lib/hooks/users/use-verify-order';
import { loadScript } from '@/lib/hooks/loadScript';

export const Upgrade = () => {
  const createOrderMutation = useCreateOrder();
  const verifyOrderMutation = useVerifyPayment();

  const verifyPayment = async (orderData: any) => {
    verifyOrderMutation.mutate(
      {
        signature: orderData.razorpay_signature,
        orderId: orderData.razorpay_order_id,
        paymentId: orderData.razorpay_payment_id,
      },
      {
        onSuccess: () => {
          console.log('Payment Verified');
        },
        onError: () => {
          console.log('Payment Not Verified');
        },
      }
    );
  };

  const onPayment = async () => {
    createOrderMutation.mutate(
      {
        planId: 'premium',
      },
      {
        onSuccess: (data) => {
          const paymentObject = new (window as any).Razorpay({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
            order_id: data.data.id,
            ...data.data,
            handler: async function (response: any) {
              console.log(response);
              await verifyPayment(response);
            },
          });
          paymentObject.open(); // Opens the Razorpay payment modal
        },
        onError: () => {
          console.log('Order creation failed');
        },
      }
    );
  };

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, [])
  
  return (
    <button onClick={onPayment} className="w-full mt-4">
      Upgrade to Premium
    </button>
  );
};
