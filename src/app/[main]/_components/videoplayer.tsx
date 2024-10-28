"use client";
import { userCheckPremium } from '@/lib/hooks/users/user-check-premium';
import { ButtonHTMLAttributes, use } from 'react';
import React from 'react';
import { Upgrade } from '../Upgrade';
import { useSignedUrl } from '@/lib/hooks/users/use-get-signurl-auth';

export const VideoPlayer = () => {
  const {
    data: isPremium,
    isPending,
    isError,
  } = userCheckPremium();

  const {data : signedUrl,
    isPending : isSignedUrlPending,
    isError : isSignedUrlError,
  } = useSignedUrl("https://iframe.mediadelivery.net/embed/331713/92cd83f1-d2f2-43ae-a343-faabbae0f56d?token=d74ed04485f3dbd1204908cb005a9b95e0955d0217b8966916e9a1e034d50563&expires=1730207841")
  if (isPending || isSignedUrlPending) {
    return <div>Loading...</div>
  }
  
  if (isError || isSignedUrlError) {
    return <div>Error while Loading Video</div>
  }

  if (!isPremium || !signedUrl) {
    return (
      <div>
        <p>Upgrade to Premium to watch Videos</p>
        <Upgrade/>
      </div>
    );
  }

  return (
    <iframe
      src={signedUrl}
      loading="lazy"
      style={{
        border: 0,
        position: "absolute",
        top: 0,
        height: "100%",
        width: "100%",
      }}
      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
};
