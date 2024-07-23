import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Server } from "lucide-react";

export default function NotFound() {
  return (
    <div className="w-screen h-12 border-b fixed backdrop-blur flex">
      <div className="me-auto mt-3 pl-7">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="max-sm:hidden">
              <Server />
            </BreadcrumbItem>
            <BreadcrumbSeparator className="max-sm:hidden" />
            <BreadcrumbItem>
              <BreadcrumbPage>Not Found</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
