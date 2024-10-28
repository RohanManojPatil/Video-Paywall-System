import Image from "next/image";
import {auth} from '@/auth';
import { redirect } from "next/navigation";
import { VideoPlayer } from "./videoplayer";
export default async function Home() {
  const session = await auth();
  if(!session){
      redirect("api/auth/signin");
  }
  return (
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
            <VideoPlayer></VideoPlayer>
        </div>
      </main>
  );
}
