"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { inspectChatMessage } from "@/services/scam-interceptor";
import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  Check,
  CheckCheck,
  Flag,
  MapPin,
  MessageSquare,
  MoreVertical,
  Search,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";

interface ChatMessageItem {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
  flagged?: boolean;
}

interface ChatContact {
  id: string;
  name: string;
  roleType: string;
  taskOrOppTitle: string;
  location: string;
  avatarColor: string;
  avatarInitials: string;
  unreadCount?: number;
  lastMessage: string;
  lastMessageTime: string;
  verified: boolean;
  blocked?: boolean;
  securityViolationDetected?: boolean;
  violationReason?: string;
  messages: ChatMessageItem[];
}

const INITIAL_REQUESTER_CHATS: ChatContact[] = [
  {
    id: "req-chat-1",
    name: "Sipho Dlamini",
    roleType: "Verified Youth",
    taskOrOppTitle: "Spaza Stock Counting & Tally",
    location: "Orlando East, Soweto",
    avatarColor: "bg-emerald-600",
    avatarInitials: "SD",
    unreadCount: 1,
    lastMessage: "I can arrive at 9:00 AM sharp with my reference letter.",
    lastMessageTime: "08:21",
    verified: true,
    blocked: false,
    securityViolationDetected: false,
    messages: [
      {
        id: "m-1",
        sender: "them",
        text: "Sawubona! I saw your spaza stock counting task on Kasirize.",
        time: "08:15",
      },
      {
        id: "m-2",
        sender: "me",
        text: "Hello Sipho! Yes, do you have experience with basic tally sheets and stock counts?",
        time: "08:18",
      },
      {
        id: "m-3",
        sender: "them",
        text: "I can arrive at 9:00 AM sharp with my reference letter.",
        time: "08:21",
      },
    ],
  },
  {
    id: "req-chat-2",
    name: "Lerato Mokoena",
    roleType: "Verified Youth",
    taskOrOppTitle: "Bakery Scone Packaging",
    location: "Diepkloof, Zone 4",
    avatarColor: "bg-brand-deep",
    avatarInitials: "LM",
    unreadCount: 0,
    lastMessage:
      "Completed the batch packaging and submitted photos for review!",
    lastMessageTime: "Yesterday",
    verified: true,
    blocked: false,
    securityViolationDetected: false,
    messages: [
      {
        id: "m-4",
        sender: "them",
        text: "Sawubona Baba Khumalo, all 200 bags of scones are labeled and boxed.",
        time: "Yesterday 16:30",
      },
      {
        id: "m-5",
        sender: "them",
        text: "Completed the batch packaging and submitted photos for review!",
        time: "Yesterday 16:32",
      },
      {
        id: "m-6",
        sender: "me",
        text: "Excellent work Lerato! Checking the photos and confirming task completion now.",
        time: "Yesterday 16:40",
      },
    ],
  },
  {
    id: "req-chat-3",
    name: "Unverified Inquirer",
    roleType: "Unverified User",
    taskOrOppTitle: "Flyer Distribution",
    location: "Meadowlands",
    avatarColor: "bg-rose-600",
    avatarInitials: "UI",
    unreadCount: 1,
    lastMessage: "Send upfront deposit via eWallet PIN before I start walking.",
    lastMessageTime: "07:50",
    verified: false,
    blocked: false,
    securityViolationDetected: true,
    violationReason:
      "Demanding off-platform upfront payment or eWallet PIN (violates escrow guarantee)",
    messages: [
      {
        id: "m-7",
        sender: "them",
        text: "Hi, I can distribute the flyers around the taxi rank today.",
        time: "07:45",
      },
      {
        id: "m-8",
        sender: "them",
        text: "Send upfront deposit via eWallet PIN before I start walking.",
        time: "07:50",
        flagged: true,
      },
    ],
  },
];

export default function RequesterChatPage() {
  const [chats, setChats] = useState<ChatContact[]>(INITIAL_REQUESTER_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  const filteredChats = chats.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.taskOrOppTitle.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q)
    );
  });

  const activeChat = useMemo(() => {
    return chats.find((c) => c.id === activeChatId) || chats[0];
  }, [chats, activeChatId]);

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setChats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)),
    );
  };

  const handleBlockPerson = (contactId: string) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === contactId
          ? {
              ...c,
              blocked: true,
            }
          : c,
      ),
    );
    setIsBlockModalOpen(false);
    toast.error(`${activeChat.name} has been blocked. Messages disabled.`);
  };

  const handleUnblockPerson = (contactId: string) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === contactId
          ? {
              ...c,
              blocked: false,
              securityViolationDetected: false,
            }
          : c,
      ),
    );
    toast.success(`${activeChat.name} unblocked.`);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat) return;

    if (activeChat.blocked || activeChat.securityViolationDetected) {
      toast.error(
        "Messaging is disabled for this conversation due to security restrictions.",
      );
      return;
    }

    const text = messageInput.trim();
    const inspection = inspectChatMessage(text);
    const isUnwanted =
      !inspection.safe &&
      (inspection.action === "block_and_review" ||
        inspection.action === "hold_for_review" ||
        inspection.action === "reject" ||
        inspection.action === "warn_user" ||
        inspection.categories.length > 0);

    const newMsg: ChatMessageItem = {
      id: `msg-${Date.now()}`,
      sender: "me",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      flagged: isUnwanted,
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChat.id
          ? {
              ...c,
              lastMessage: newMsg.text,
              lastMessageTime: newMsg.time,
              securityViolationDetected: isUnwanted
                ? true
                : c.securityViolationDetected,
              violationReason: isUnwanted
                ? inspection.categories.length > 0
                  ? `Safety policy alert: ${inspection.categories.join(", ").replace(/_/g, " ")}`
                  : inspection.reason
                : c.violationReason,
              messages: [...c.messages, newMsg],
            }
          : c,
      ),
    );

    setMessageInput("");

    if (isUnwanted) {
      toast.error(
        `Security Alert: ${inspection.reason} Messaging disabled while Kasirize investigates.`,
        { duration: 5000 },
      );
    } else {
      toast.success("Message sent securely via Kasirize escrow guard.");
    }
  };

  const isChatDisabled = Boolean(
    activeChat?.blocked || activeChat?.securityViolationDetected,
  );

  return (
    <div className="flex-1 flex flex-col h-[calc(100dvh-4rem)] md:h-[calc(100dvh-1rem)] font-body">
      {/* ─── DESKTOP HEADER (HIDDEN ON MOBILE WHATSAPP-STYLE) ─── */}
      <header className="border-b border-border bg-card/90 backdrop-blur px-4 py-2.5 hidden md:flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/requester"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <ArrowLeft className="size-4" />
            <span>Dashboard</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          <h1 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
            <span>Task Requester Messages</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              WhatsApp Layout
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
          <ShieldCheck className="size-4" />
          <span>Escrow Monitored &amp; Anti-Scam Guard</span>
        </div>
      </header>

      {/* ─── WHATSAPP DUAL PANE CONTAINER ─── */}
      <div className="flex-1 flex overflow-hidden min-h-0 bg-background">
        {/* ─── LEFT ASIDE: CHAT LIST ─── */}
        <aside
          className={`w-full md:w-80 lg:w-96 border-r border-border bg-card flex flex-col shrink-0 ${
            activeChatId ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Header */}
          <div className="p-3 border-b border-border bg-card space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-base text-foreground">
                  Chats
                </h2>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {chats.length} active
              </span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search candidates or tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8.5 h-8.5 bg-muted/60 text-xs rounded-full border-none focus-visible:ring-1"
              />
            </div>
          </div>

          {/* Chat List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/60">
            {filteredChats.map((chat) => {
              const isSelected = activeChatId === chat.id;

              return (
                <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-primary/10 border-l-3 border-primary"
                      : "hover:bg-muted/60"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div
                      className={`w-11 h-11 rounded-full ${chat.avatarColor} text-white font-bold flex items-center justify-center text-sm shadow-xs`}
                    >
                      {chat.avatarInitials}
                    </div>
                    {chat.blocked ? (
                      <span className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-destructive text-white flex items-center justify-center border-2 border-card">
                        <Ban className="size-2.5" />
                      </span>
                    ) : chat.verified ? (
                      <span
                        className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-card"
                        title="Verified Youth"
                      >
                        <Check className="size-2.5 stroke-3" />
                      </span>
                    ) : null}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <div className="flex items-center gap-1.5 truncate">
                        <h3 className="font-heading font-semibold text-xs sm:text-sm text-foreground truncate">
                          {chat.name}
                        </h3>
                        {chat.blocked && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-destructive/10 text-destructive font-bold uppercase">
                            Blocked
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {chat.lastMessageTime}
                      </span>
                    </div>

                    <div className="text-[11px] text-primary font-medium truncate mb-1">
                      {chat.taskOrOppTitle}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-xs truncate line-clamp-1 ${
                          chat.securityViolationDetected
                            ? "text-destructive font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {chat.securityViolationDetected
                          ? "⚠️ Security violation detected"
                          : chat.lastMessage}
                      </p>
                      {chat.unreadCount && chat.unreadCount > 0 ? (
                        <span className="w-4.5 h-4.5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {chat.unreadCount}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-muted/40 border-t border-border flex items-center gap-2 text-[11px] text-muted-foreground">
            <Shield className="size-3.5 text-primary shrink-0" />
            <span className="line-clamp-1">
              Escrow funds released only upon completed task verification.
            </span>
          </div>
        </aside>

        {/* ─── RIGHT MAIN: CONVERSATION PANE ─── */}
        <main
          className={`flex-1 flex flex-col bg-background h-full min-w-0 ${
            !activeChatId ? "hidden md:flex" : "flex"
          }`}
        >
          {activeChat ? (
            <>
              {/* WhatsApp Active Contact Header */}
              <div className="p-3 border-b border-border bg-card flex items-center justify-between gap-3 shrink-0 shadow-xs relative">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    onClick={() => setActiveChatId(null)}
                    className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground md:hidden shrink-0"
                    aria-label="Back to chat list"
                  >
                    <ArrowLeft className="size-5" />
                  </button>

                  <div className="relative shrink-0">
                    <div
                      className={`w-9 h-9 rounded-full ${activeChat.avatarColor} text-white font-bold flex items-center justify-center text-xs shadow-xs`}
                    >
                      {activeChat.avatarInitials}
                    </div>
                    {activeChat.blocked ? (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-destructive text-white flex items-center justify-center border border-card">
                        <Ban className="size-2" />
                      </span>
                    ) : activeChat.verified ? (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center border border-card">
                        <Check className="size-2 stroke-3" />
                      </span>
                    ) : null}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h2 className="font-heading font-bold text-xs sm:text-sm text-foreground truncate">
                        {activeChat.name}
                      </h2>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground border border-border shrink-0">
                        {activeChat.roleType}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                      <MapPin className="size-2.5 text-primary shrink-0" />
                      <span>{activeChat.location}</span>
                      <span>•</span>
                      <span className="text-primary truncate">
                        {activeChat.taskOrOppTitle}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium">
                    <ShieldCheck className="size-3" />
                    <span>Escrow Guard</span>
                  </span>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      aria-label="Chat options"
                      title="Options"
                    >
                      <MoreVertical className="size-4.5" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48 text-xs">
                      {activeChat.blocked ? (
                        <DropdownMenuItem
                          onClick={() => handleUnblockPerson(activeChat.id)}
                          className="cursor-pointer gap-2"
                        >
                          <UserCheck className="size-4 text-emerald-600" />
                          <span>Unblock {activeChat.name}</span>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setIsBlockModalOpen(true)}
                          className="cursor-pointer gap-2 font-semibold"
                        >
                          <Ban className="size-4 text-destructive" />
                          <span>Block right away</span>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() =>
                          toast.success(
                            "Report submitted to Kasirize safety & dispute desk.",
                          )
                        }
                        className="cursor-pointer gap-2 text-muted-foreground"
                      >
                        <Flag className="size-4" />
                        <span>Report user</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Security Warning Banner */}
              {activeChat.securityViolationDetected && (
                <div className="p-4 bg-rose-500/15 border-b border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-foreground animate-in slide-in-from-top-2">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="size-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-rose-900 dark:text-rose-300 font-bold block text-sm">
                        Security Notice: Unwanted messages detected
                      </strong>
                      <p className="text-muted-foreground leading-relaxed mt-0.5">
                        {activeChat.violationReason ||
                          "Our safety system flagged off-platform payments or unverified credentials. Messaging has been locked while we investigate."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {!activeChat.blocked && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleBlockPerson(activeChat.id)}
                        className="text-xs font-bold gap-1 shadow-xs"
                      >
                        <Ban className="size-3.5" />
                        <span>Block Person</span>
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Escrow Guarantee Reminder */}
              {!activeChat.securityViolationDetected && !activeChat.blocked && (
                <div className="px-4 py-2 bg-primary/5 border-b border-primary/15 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <ShieldCheck className="size-3.5 text-primary shrink-0" />
                  <span>
                    Task payment is safe in Kasirize escrow. Never pay cash
                    advances before task verification.
                  </span>
                </div>
              )}

              {/* Message Feed */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                {activeChat.messages.map((m) => {
                  const isMe = m.sender === "me";

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`p-3 max-w-[85%] sm:max-w-md text-xs leading-relaxed shadow-xs ${
                          m.flagged
                            ? "bg-rose-500/20 border-2 border-rose-500/50 text-foreground rounded-2xl rounded-tl-xs"
                            : isMe
                              ? "bg-brand-deep text-white rounded-2xl rounded-tr-xs"
                              : "bg-card border border-border text-foreground rounded-2xl rounded-tl-xs"
                        }`}
                      >
                        {m.flagged && (
                          <div className="flex items-center gap-1 text-[10px] text-rose-600 font-bold uppercase mb-1">
                            <AlertTriangle className="size-3" />
                            <span>Flagged by Safety Filter</span>
                          </div>
                        )}
                        <p>{m.text}</p>
                        <div
                          className={`flex items-center justify-end gap-1 text-[9px] mt-1 ${
                            isMe ? "text-white/75" : "text-muted-foreground"
                          }`}
                        >
                          <span>{m.time}</span>
                          {isMe && (
                            <CheckCheck className="size-3 text-accent" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input or Disabled Notice */}
              {isChatDisabled ? (
                <div className="p-3 border-t border-border bg-muted/60 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Ban className="size-4 text-destructive shrink-0" />
                    <span>
                      {activeChat.blocked
                        ? `You have blocked ${activeChat.name}. You cannot send or receive messages.`
                        : "Messaging disabled while Kasirize investigates unwanted content."}
                    </span>
                  </div>
                  {activeChat.blocked && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUnblockPerson(activeChat.id)}
                      className="text-xs shrink-0"
                    >
                      Unblock
                    </Button>
                  )}
                </div>
              ) : (
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 border-t border-border bg-card flex items-center gap-2 shrink-0"
                >
                  <Input
                    placeholder={`Reply to ${activeChat.name}... (e.g. Try typing 'send ewallet pin')`}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="bg-muted/50 text-xs rounded-full h-10 px-4 focus-visible:ring-1"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!messageInput.trim()}
                    className="rounded-full size-10 p-0 shrink-0 bg-brand-deep text-white hover:opacity-90 flex items-center justify-center cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Send className="size-4" />
                  </Button>
                </form>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <MessageSquare className="size-6 text-muted-foreground" />
              </div>
              <h3 className="font-heading font-bold text-sm text-foreground">
                Select a candidate conversation
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs mt-1">
                Coordinate task details and arrival times safely in platform
                chat.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Block Dialog */}
      <Dialog open={isBlockModalOpen} onOpenChange={setIsBlockModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="size-10 rounded-full bg-destructive/15 text-destructive flex items-center justify-center mb-2">
              <UserX className="size-5" />
            </div>
            <DialogTitle className="font-heading text-base font-bold text-foreground">
              Block {activeChat?.name}?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Blocked candidates will not be able to message you or apply for
              your posted tasks.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsBlockModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => handleBlockPerson(activeChat.id)}
              className="text-xs font-semibold gap-1"
            >
              <Ban className="size-3.5" />
              <span>Confirm Block</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
