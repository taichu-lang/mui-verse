"use client";

import { ChatIcon, DeleteIcon, PencilIcon } from "@/components/icons";
import { PinnerIcon } from "@/components/icons/Pinner";
import { Accordion } from "@/components/ui/Accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mui-verse/ui/components/navigation";
import { Menu } from "@mui-verse/ui/layout/Menu";
import { MenuButton } from "@mui-verse/ui/layout/MenuButton";
import { useSidebar } from "@mui-verse/ui/layout/useSidebar";
import { cn } from "@mui-verse/ui/utils/cn";
import { Typography } from "@mui/material";
import { EllipsisIcon } from "lucide-react";

export function ChatActionItems({ pinned = false }: { pinned?: boolean }) {
  return (
    <DropdownMenuContent shadow="none" sx={{ py: "14px", minWidth: "194px" }}>
      <DropdownMenuItem className="gap-2.5">
        <PencilIcon />
        Rename
      </DropdownMenuItem>
      <DropdownMenuItem className="gap-2.5">
        <PinnerIcon />
        {pinned ? "Unpin chat" : "Pin Chat"}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="text-error-500 hover:bg-error-200 gap-2.5">
        <DeleteIcon />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

function ChatAction({ pinned = false }: { pinned?: boolean }) {
  return (
    <DropdownMenu side="right" align="start">
      <DropdownMenuTrigger>
        <EllipsisIcon className="hidden h-4 w-4 group-hover:block" />
      </DropdownMenuTrigger>
      <ChatActionItems pinned={pinned} />
    </DropdownMenu>
  );
}

function DropdownChatMenu({
  title,
  pinned = false,
}: {
  title: string;
  pinned?: boolean;
}) {
  return (
    <div className="hover:bg-action-hover group flex h-8 cursor-pointer items-center gap-2.5 rounded-lg px-2.5">
      <ChatIcon className="shrink-0" />
      <Typography
        variant="body2"
        className="overflow-hidden leading-4.5 text-clip whitespace-nowrap"
      >
        {title}
      </Typography>
      <div className="flex-1" />
      <ChatAction pinned={pinned} />
    </div>
  );
}

export function ChatHistory({
  pinned = false,
  className,
}: {
  pinned?: boolean;
  className?: string;
}) {
  const { collapsed } = useSidebar();
  const title = pinned ? "Pinned" : "Recents";
  const history = [
    "获取浏览器屏幕高度",
    "高考报名指导",
    "Taskfile中定义可被多个cmds引用的变量",
    "Tauri",
    "解决IndexDB强制刷新丢数据的问题",
    "生成志愿报告",
    "Strapi日志输出到文件的方法",
    "Tailwind",
    "MUI中是否能用Menu实现Select？",
  ];

  if (collapsed) {
    return (
      <DropdownMenu side="right" align="start">
        <DropdownMenuTrigger>
          <MenuButton
            title="history"
            icon={pinned ? <PinnerIcon /> : <ChatIcon />}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          sx={{
            maxWidth: "274px",
            width: "100%",
            px: "8px",
          }}
        >
          <p className="mb-2 ml-2.5 text-sm font-semibold">{title}</p>
          <div className="flex flex-col gap-0.5">
            {history.map((chat, index) => (
              <DropdownChatMenu key={index} title={chat} />
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Accordion title={title} className={cn("gap-0.5", className)}>
      {history.map((chat, index) => (
        <Menu
          title={chat}
          key={index}
          actions={<ChatAction />}
          showTips={false}
        />
      ))}
    </Accordion>
  );
}
