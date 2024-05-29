import Image from "next/image";

export default function Loading() {
  return (
    <div className="h-40 w-40 mx-auto">
      <Image
      
      className="text-[#cc0000] fill-[#cc0000]"
      src={"/spinner.svg"} width={200} height={200} alt="spinner" />
    </div>
  );
}
