"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mui-verse/ui/components/navigation";
import { cn } from "@mui-verse/ui/utils/cn";
import { Avatar, AvatarGroup, Divider, Drawer } from "@mui/material";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { create } from "zustand";
import { IconGhostButton } from "../buttons";
import { MessageAnnotation } from "./types";

const FaviconIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="7" cy="7" r="7" fill="#E2E2E2" />
      <g clipPath="url(#clip0_1599_14337)">
        <path
          d="M7.00004 11.1673C9.30123 11.1673 11.1667 9.30184 11.1667 7.00065C11.1667 4.69946 9.30123 2.83398 7.00004 2.83398C4.69885 2.83398 2.83337 4.69946 2.83337 7.00065C2.83337 9.30184 4.69885 11.1673 7.00004 11.1673Z"
          stroke="#767676"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.33337 7.00065C5.33337 5.44929 5.93014 3.95738 7.00004 2.83398C8.06994 3.95738 8.66671 5.44929 8.66671 7.00065C8.66671 8.55201 8.06994 10.0439 7.00004 11.1673C5.93014 10.0439 5.33337 8.55201 5.33337 7.00065Z"
          stroke="#767676"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.83337 7H11.1667"
          stroke="#767676"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1599_14337">
          <rect
            width="10"
            height="10"
            fill="white"
            transform="translate(2 2)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export function SearchAnnotation({
  site_name,
  title,
  url,
}: {
  site_name: string;
  title: string;
  url: string;
}) {
  // site_name is the `og:title` of the page, it might be empty, in that case,
  // we use the hostname.
  //
  // The response of llm contains `url` and `title`, we need to fetch the metadata
  // of the page ourselves, to get the `og:title` and favicon. However, we might
  // be blocked by the remote server, ex: network error, whitelist. Meanwhile,
  // `og:title` and favicon are not strictly required specifications.
  const getSite = () => {
    if (site_name) {
      return site_name;
    }

    const uri = new URL(url);
    return uri.hostname;
  };

  const name = getSite();

  return (
    <Popover side="top" closeDelay={300}>
      <PopoverTrigger>
        <a
          href={url}
          target="_blank"
          className={cn(
            "bg-action-hover hover:bg-divider mx-2.5 rounded-full px-2 py-px text-xs",
            "ring-divider ring-1 ring-inset", // border
            "max-w-45 truncate",
          )}
          data-annotation={true}
        >
          {name}
        </a>
      </PopoverTrigger>
      <PopoverContent sx={{ px: "4px", py: "4px", mt: "-6px", width: "290px" }}>
        <Link
          href={url}
          className="hover:bg-action-hover flex flex-col gap-2.5 rounded-xl p-2.5"
          target="_blank"
        >
          <span className="text-sm">{title}</span>
          <div className="flex items-center gap-1">
            <FaviconIcon />
            <span className="text-text-secondary text-xs">{name}</span>
          </div>
        </Link>
      </PopoverContent>
    </Popover>
  );
}

function keyOfAnnotation(annotation: MessageAnnotation): string {
  // The client side will accept message annotations before the server side
  // saves them into database. In that case, `annotation.id` is 0.
  if (annotation.id > 0) {
    return annotation.id.toString();
  }

  return `${annotation.message_id}-anno-${annotation.start_index}`;
}

export function AnnotationAvatarGroup({
  annotations,
  className,
}: {
  annotations?: MessageAnnotation[];
  className?: string;
}) {
  const { setAnnotations } = useAnnotationSources();

  if (!annotations) {
    return null;
  }

  return (
    <div
      className={cn(
        "hover:bg-action-hover flex items-center gap-2.5 rounded-full p-1.5 hover:cursor-pointer",
        className,
      )}
      onClick={() => setAnnotations(annotations)}
    >
      <AvatarGroup spacing={"medium"}>
        {annotations.slice(0, 4).map((annotation) => {
          const payload = annotation.payload;
          const key = keyOfAnnotation(annotation);
          return payload.icon ? (
            <Avatar
              className="h-4.5 w-4.5 border-none"
              key={key}
              src={payload.icon}
              alt={payload.title}
            />
          ) : (
            <Avatar key={key} className="h-4.5 w-4.5 border-none">
              <FaviconIcon className="h-4.5 w-4.5" />
            </Avatar>
          );
        })}
      </AvatarGroup>
      <span className="text-text-secondary text-sm">Sources</span>
    </div>
  );
}

interface AnnotationSources {
  open: boolean;
  annotations: MessageAnnotation[];

  setOpen: (open: boolean) => void;
  setAnnotations: (annotations: MessageAnnotation[]) => void;
}

export const useAnnotationSources = create<AnnotationSources>()((set) => ({
  open: false,
  annotations: [],

  setOpen: (open: boolean) => set({ open }),
  setAnnotations: (annotations: MessageAnnotation[]) =>
    set({ annotations, open: annotations.length > 0 }),
}));

function AnnotationCard({ annotation }: { annotation: MessageAnnotation }) {
  const uri = new URL(annotation.payload.url);
  const host = uri.hostname;

  return (
    <Link
      href={annotation.payload.url}
      className="hover:bg-action-hover flex flex-col items-baseline rounded-[14px] p-2.5"
      target="_blank"
    >
      <div className="flex items-center gap-2">
        <FaviconIcon className="h-4 w-4" />
        <span className="text-xs">{host}</span>
      </div>
      <span className="mt-2.5 text-sm font-medium">
        {annotation.payload.title}
      </span>
    </Link>
  );
}

export function AnnotationSourceListView({
  width,
}: {
  width: string | number;
}) {
  const { open, setOpen, annotations, setAnnotations } = useAnnotationSources();
  const paperWidth = open ? width : 0;

  const handleClose = () => {
    setOpen(false);
    setAnnotations([]);
  };

  return (
    <Drawer
      open={open}
      variant="persistent"
      onClose={handleClose}
      sx={{
        width: paperWidth,
        flexShrink: 0,
        height: "100%",
        "& .MuiDrawer-paper": {
          width: paperWidth,
          boxSizing: "border-box",
          border: 0,
          background: "transparent",
        },
        boxShadow: "inset 1px 0 0 0 var(--mui-palette-divider)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      anchor="right"
    >
      <div className="mx-5 flex h-15 items-center justify-between">
        <span className="text-lg">Sources</span>
        <IconGhostButton onClick={handleClose}>
          <XIcon className="h-4.5 w-4.5" />
        </IconGhostButton>
      </div>
      <Divider flexItem />
      <div className="m-2.5 flex-1 overflow-y-auto">
        {annotations.map((annotation) => (
          <AnnotationCard
            key={keyOfAnnotation(annotation)}
            annotation={annotation}
          />
        ))}
      </div>
    </Drawer>
  );
}
