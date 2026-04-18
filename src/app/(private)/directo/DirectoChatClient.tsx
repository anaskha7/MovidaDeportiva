"use client";

import * as Ably from "ably";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n-shared";
import {
  PROFILE_AVATAR_STORAGE_KEY,
  sanitizeProfileAvatarUrl,
} from "@/lib/profile-avatar";
import { getAblyClient } from "@/lib/ably-client";
import {
  buildLiveChatPayload,
  getLiveChatChannelName,
  LIVE_CHAT_EVENT,
  LIVE_CHAT_HISTORY_LIMIT,
  LIVE_CHAT_MESSAGE_MAX_LENGTH,
  mapLiveChatPayloadToUiMessage,
  type LiveChatUiMessage,
} from "@/lib/live-chat";
import type { Rol } from "@/lib/types";
import styles from "./Directo.module.css";

type DirectoChatClientProps = {
  ablyToken: string | null;
  avatarUrl?: string | null;
  locale: Locale;
  matchId: string;
  name: string;
  role?: Rol | null;
  title: string;
  placeholder: string;
};

type ChatStatus = "connecting" | "connected" | "error";

const COPY: Record<
  Locale,
  {
    connecting: string;
    empty: string;
    error: string;
    live: string;
    offline: string;
    send: string;
  }
> = {
  es: {
    connecting: "Conectando…",
    empty: "Todavía no hay mensajes.",
    error: "No se ha podido conectar el chat.",
    live: "En línea",
    offline: "Sin conexión",
    send: "Enviar mensaje",
  },
  ca: {
    connecting: "Connectant…",
    empty: "Encara no hi ha missatges.",
    error: "No s'ha pogut connectar el xat.",
    live: "En línia",
    offline: "Sense connexió",
    send: "Enviar missatge",
  },
  en: {
    connecting: "Connecting…",
    empty: "No messages yet.",
    error: "The chat could not connect.",
    live: "Live",
    offline: "Offline",
    send: "Send message",
  },
};

export default function DirectoChatClient({
  ablyToken,
  avatarUrl: initialAvatarUrl,
  locale,
  matchId,
  name,
  role,
  title,
  placeholder,
}: DirectoChatClientProps) {
  const copy = COPY[locale];
  const [messages, setMessages] = useState<LiveChatUiMessage[]>([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<ChatStatus>("connecting");
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const channelRef = useRef<Ably.RealtimeChannel | null>(null);
  const knownMessageIdsRef = useRef<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const channelName = useMemo(() => getLiveChatChannelName(matchId), [matchId]);

  useEffect(() => {
    const persistedAvatar = sanitizeProfileAvatarUrl(initialAvatarUrl);

    if (persistedAvatar) {
      window.localStorage.setItem(PROFILE_AVATAR_STORAGE_KEY, persistedAvatar);
      setAvatarUrl(persistedAvatar);
      return;
    }

    const savedAvatar = window.localStorage.getItem(PROFILE_AVATAR_STORAGE_KEY);
    const normalizedSavedAvatar = sanitizeProfileAvatarUrl(savedAvatar);

    if (normalizedSavedAvatar) {
      setAvatarUrl(normalizedSavedAvatar);
      return;
    }

    window.localStorage.removeItem(PROFILE_AVATAR_STORAGE_KEY);
    setAvatarUrl(null);
  }, [initialAvatarUrl]);

  useEffect(() => {
    if (!ablyToken) {
      setStatus("error");
      setErrorText(copy.error);
      return;
    }

    let disposed = false;
    const client = getAblyClient(ablyToken);
    const channel = client.channels.get(channelName);
    channelRef.current = channel;
    knownMessageIdsRef.current = new Set();
    setMessages([]);
    setErrorText(null);
    setStatus("connecting");

    const mergeMessages = (incoming: LiveChatUiMessage[]) => {
      if (!incoming.length) return;

      setMessages((current) => {
        const merged = new Map<string, LiveChatUiMessage>();

        for (const item of current) {
          merged.set(item.id, item);
        }

        for (const item of incoming) {
          merged.set(item.id, item);
        }

        return Array.from(merged.values())
          .sort((left, right) => left.timestamp - right.timestamp)
          .slice(-LIVE_CHAT_HISTORY_LIMIT);
      });
    };

    const handleConnectionChange = (change: Ably.ConnectionStateChange) => {
      if (disposed) return;

      if (change.current === "connected") {
        setStatus("connected");
        setErrorText(null);
        return;
      }

      if (change.current === "failed" || change.current === "suspended") {
        setStatus("error");
        setErrorText(copy.error);
        return;
      }

      setStatus("connecting");
    };

    const handleIncomingMessage = (message: Ably.InboundMessage) => {
      if (disposed) return;

      const chatMessage = mapLiveChatPayloadToUiMessage(
        message.data,
        locale,
        message.id,
        message.timestamp,
      );

      if (!chatMessage || knownMessageIdsRef.current.has(chatMessage.id)) {
        return;
      }

      knownMessageIdsRef.current.add(chatMessage.id);
      mergeMessages([chatMessage]);
    };

    const connectToChannel = async () => {
      try {
        client.connection.on(handleConnectionChange);
        channel.subscribe(LIVE_CHAT_EVENT, handleIncomingMessage);
        await channel.attach();

        const historyPage = await channel.history({ limit: LIVE_CHAT_HISTORY_LIMIT });

        if (disposed) return;

        const historyMessages = historyPage.items
          .filter((message) => message.name === LIVE_CHAT_EVENT)
          .sort((left, right) => (left.timestamp ?? 0) - (right.timestamp ?? 0))
          .map((message) =>
            mapLiveChatPayloadToUiMessage(message.data, locale, message.id, message.timestamp),
          )
          .filter((message): message is LiveChatUiMessage => Boolean(message));

        historyMessages.forEach((message) => {
          knownMessageIdsRef.current.add(message.id);
        });

        mergeMessages(historyMessages);
        setStatus(client.connection.state === "connected" ? "connected" : "connecting");
      } catch (error) {
        if (disposed) return;

        setStatus("error");
        setErrorText(copy.error);
        console.error("No se pudo conectar el chat en directo", error);
      }
    };

    void connectToChannel();

    return () => {
      disposed = true;
      channel.unsubscribe(LIVE_CHAT_EVENT, handleIncomingMessage);
      client.connection.off(handleConnectionChange);
      channelRef.current = null;
    };
  }, [ablyToken, channelName, copy.error, locale]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const sendMessage = async () => {
    const channel = channelRef.current;
    const payload = buildLiveChatPayload({ name, role, avatarUrl }, text);

    if (!channel || !payload || isSending) {
      return;
    }

    try {
      setIsSending(true);
      await channel.publish(LIVE_CHAT_EVENT, payload);
      setText("");
      setErrorText(null);
    } catch (error) {
      setStatus("error");
      setErrorText(copy.error);
      console.error("No se pudo publicar un mensaje en el chat", error);
    } finally {
      setIsSending(false);
    }
  };

  const statusLabel =
    status === "connected"
      ? copy.live
      : status === "error"
        ? copy.offline
        : copy.connecting;

  const statusClassName =
    status === "connected"
      ? styles.chatDotConnected
      : status === "error"
        ? styles.chatDotError
        : styles.chatDotConnecting;

  const isComposerDisabled = status !== "connected" || isSending;

  return (
    <aside className={`${styles.chatPanel} ${styles.chatPanelFloating}`}>
      <div className={styles.chatHeader}>
        <strong>{title}</strong>
        <div className={styles.chatHeaderState}>
          <span className={`${styles.chatDot} ${statusClassName}`} />
          <span className={styles.chatStatusText}>{statusLabel}</span>
        </div>
      </div>

      <div className={styles.chatMessages}>
        {!messages.length ? <p className={styles.chatEmpty}>{copy.empty}</p> : null}
        {messages.map((item) => (
          <div key={item.id} className={styles.chatItem}>
            <div className={styles.chatAvatar}>
              {item.avatarUrl ? (
                <img src={item.avatarUrl} alt={item.name} />
              ) : (
                <span>{getInitials(item.name)}</span>
              )}
            </div>
            <div>
              <div className={styles.chatMeta}>
                <strong>{item.name}</strong>
                <span>{item.timeLabel}</span>
              </div>
              <p>{item.message}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className={styles.chatInput}>
        <input
          value={text}
          onChange={(event) => setText(event.target.value.slice(0, LIVE_CHAT_MESSAGE_MAX_LENGTH))}
          placeholder={placeholder}
          className={styles.chatInputField}
          disabled={isComposerDisabled}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void sendMessage();
            }
          }}
        />
        <button
          type="button"
          onClick={() => void sendMessage()}
          aria-label={copy.send}
          disabled={isComposerDisabled}
          className={styles.chatSendButton}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4.75 11.25 18.62 4.7c.76-.36 1.56.33 1.35 1.14l-2.97 11.72c-.21.83-1.23 1.04-1.74.36l-2.83-3.8-3.6 2.44c-.63.43-1.49-.03-1.47-.79l.08-3.36-2.92-.25c-.88-.08-1.06-1.29-.27-1.66Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      {errorText ? <p className={styles.chatErrorText}>{errorText}</p> : null}
    </aside>
  );
}

function getInitials(value: string) {
  const initials = value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "U";
}
