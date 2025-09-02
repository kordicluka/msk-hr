"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/atoms/sidebar";
import { Button } from "@/components/atoms/admin/button";
import Link from "next/link";
import Image from "next/image";

export function AdminSidebar({
  items,
  title,
  bottomButtons,
}: {
  items: {
    title: string;
    description?: string;
    image: string;
    id: string;
    content?: React.ReactNode;
  }[];
  title?: string;
  bottomButtons: {
    label: string;
    href: string;
  }[];
}) {
  return (
    <Sidebar className="translate-x-[5rem] mt-14 bg-white h-[calc(100vh-4rem)]">
      <SidebarHeader className="pl-2 pr-4">
        <div className="flex items-center justify-between">
          {title && (
            <h6 className="text-3xl tracking-tighter text-gray-900 font-semibold">
              {title}
            </h6>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="pl-2 pr-4">
        <div className="flex flex-col gap-4 pt-4">
          {items.map((item) => (
            <ItemButton key={item.id} {...item} content={item.content} />
          ))}
        </div>
      </SidebarContent>
      <SidebarFooter className="pl-2 pr-4 pb-2">
        {bottomButtons.map((button) => (
          <Link href={button.href} key={button.label}>
            <Button className="w-full">{button.label}</Button>
          </Link>
        ))}
      </SidebarFooter>
    </Sidebar>
  );
}

const ItemButton = ({
  title,
  description,
  image,
  id,
  content,
}: {
  title: string;
  description?: string;
  image: string;
  id: string;
  content?: React.ReactNode;
}) => {
  return (
    <Link
      href={`/admin/services/${id}`}
      className="cursor-pointer flex flex-col gap-3"
    >
      {content ? (
        content
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex p-2 bg-gray-100  border border-transparent  rounded-md  items-center gap-3">
            <Image
              src={image}
              alt={title}
              width={20}
              height={20}
              className="h-6 w-6"
            />
          </div>
          <div className="flex flex-col">
            <span className=" font-medium">{title}</span>
            {description && (
              <span className="text-xs  text-muted-foreground">
                {description?.slice(0, 30)}...
              </span>
            )}
          </div>
        </div>
      )}
    </Link>
  );
};
