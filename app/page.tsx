import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <Image src="/logo.png" alt="Logo" width={100} height={100} />
    </div>
  );
}
