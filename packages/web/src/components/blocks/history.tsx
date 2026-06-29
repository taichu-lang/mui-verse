"use client";

import { PinnerIcon } from "@/components/icons/PinnerIcon";
import { Accordion } from "@/components/ui/Accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@mui-verse/ui/components/navigation";
import { Menu } from "@mui-verse/ui/layout/Menu";
import { MenuButton } from "@mui-verse/ui/layout/MenuButton";
import { useSidebar } from "@mui-verse/ui/layout/useSidebar";
import { cn } from "@mui-verse/ui/utils/cn";
import { Typography } from "@mui/material";
import { MessageCircleIcon } from "lucide-react";

function DropdownChatMenu({ title }: { title: string }) {
  return (
    <div className="hover:bg-action-hover flex h-8 cursor-pointer items-center gap-2.5 rounded-lg px-2.5">
      <MessageCircleIcon className="h-4 w-4" />
      <Typography variant="body2" className="truncate leading-4.5">
        {title}
      </Typography>
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
            icon={
              pinned ? (
                <PinnerIcon />
              ) : (
                <MessageCircleIcon className="h-4 w-4" />
              )
            }
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          sx={{
            maxWidth: "274px",
            width: "100%",
            px: "8px",
          }}
        >
          <p className="anna-text-tag mb-2 ml-2.5 font-semibold">{title}</p>
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
        <Menu title={chat} key={index} />
      ))}
    </Accordion>
  );
}
