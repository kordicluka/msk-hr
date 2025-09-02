"use client";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link,
  ImageIcon,
  ChevronDown,
  Undo,
  Redo,
  Printer,
  PaintBucket,
  Type,
} from "lucide-react";
import { Button } from "@/components/atoms/admin/button";
import { Separator } from "@/components/atoms/admin/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/admin/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/atoms/admin/tooltip";

export default function AdminToolbar() {
  return (
    <TooltipProvider>
      <div className="border-b bg-white px-4 py-2">
        <div className="flex items-center gap-1 flex-wrap">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Undo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Poništi</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Redo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ponovi</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Printer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Štampaj</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Font and Size */}
          <div className="flex items-center gap-2">
            <Select defaultValue="times">
              <SelectTrigger className="w-32 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="times">Times New Roman</SelectItem>
                <SelectItem value="arial">Arial</SelectItem>
                <SelectItem value="helvetica">Helvetica</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="12">
              <SelectTrigger className="w-16 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="11">11</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="14">14</SelectItem>
                <SelectItem value="16">16</SelectItem>
                <SelectItem value="18">18</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Text Formatting */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Bold className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Podebljano</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Italic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Kurziv</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Underline className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Podvučeno</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Text Color */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Type className="h-4 w-4" />
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Boja teksta</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <PaintBucket className="h-4 w-4" />
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Boja pozadine</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Alignment */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <AlignLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Poravnaj lijevo</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <AlignCenter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Centriraj</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <AlignRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Poravnaj desno</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <AlignJustify className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Opravdaj</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Lists */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <List className="h-4 w-4" />
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Lista s oznakama</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ListOrdered className="h-4 w-4" />
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Numerirana lista</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Insert */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Link className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Umetni link</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Umetni sliku</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
