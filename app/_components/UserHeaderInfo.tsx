"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
function UserHeaderInfo() {
  return <section></section>;
}

export function AvatarDemo() {
  return (
    <Avatar>
      <AvatarImage src="" alt="Avatar" className="" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}

export default UserHeaderInfo;
