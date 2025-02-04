"use client";

import { useEffect, useState } from "react";
import GameHeader from "./header";
import { useParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import Game from "./game";
import Chats from "./chats";

export default function GameLayout() {
  const router = useRouter();
  const { room_id } = useParams();
  const [feedback, setFeedback] = useState<string[]>([]);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [hand, setHand] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  const [name, setName] = useState("");
  const [user_id, setUserId] = useState(0);
  const [next_to_play, setNextToPlay] = useState<number | null>(null);

  const [players, setPlayers] = useState<
    {
      id: number;
      name: string;
      admin?: boolean;
      me?: boolean;
      made_cards: string[];
      cards: [];
      thrown?: string[];
      next_to_play?: boolean;
      scores: {
        value: number;
      }[];
    }[]
  >([]);
  const [round, setRound] = useState(0);
  const [playing_round, setPlayingRound] = useState<{
    RoundCards: {
      player: { id: number; name: string };
      made_cards: string[];
      cards: string[];
      thrown: string[];
    }[];
    round: number;
    status: string;
  } | null>(null);
  if (transport) {
    console.log("Connected with", transport);
  }

  const startGame = () => {
    if (socket) socket?.emit(`distribute-cards`);
    else console.log("socket not connected");
  };

  const commitCards = (cards: string[]) => {
    if (socket) socket?.emit(`play-card`, { cards });
    else console.log("socket not connected");
  };

  const throwCards = (cards: string[]) => {
    if (socket) socket?.emit(`throw-cards`, { cards });
    else console.log("socket not connected");
  };

  useEffect(() => {
    const username = localStorage.getItem("username");
    const user_id = localStorage.getItem("user_id");
    if (!username || !user_id) {
      router.replace("/");
    }

    setUserId(parseInt(user_id || "0"));

    const socket = io(process.env.NEXT_PUBLIC_API_URL as string, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      extraHeaders: {
        user_id: user_id || "",
        username: username || "",
        table_id: room_id as string,
      },
    });

    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);

      setSocket(socket);

      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on(`feedback`, (data) => {
      console.log("[feedback] :", data);
      setFeedback((f) => [...f, data]);
    });

    socket.on(`table_${room_id}_feedback`, (data) => {
      console.log("[feedback] :", data);
      setFeedback((f) => [...f, data]);
    });

    socket.on(`table_${room_id}_updates`, (data) => {
      console.log("tbl_updts", data);
      setName(data.name);
      setNextToPlay(data.next_to_play?.id || null);
      setPlayers(
        data.players.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (p: any) =>
            ({
              ...p,
              admin: p.id === data.party_owner_id,
              me: p.id === parseInt(user_id || "0"),
              made_cards:
                data.playing_round?.RoundCards.filter(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (x: any) => x.player.id === p.id
                )[0]?.made_cards || [],
              cards:
                data.playing_round?.RoundCards.filter(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (x: any) => x.player.id === p.id
                )[0]?.cards || [],
              thrown:
                data.playing_round?.RoundCards.filter(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (x: any) => x.player.id === p.id
                )[0]?.thrown || [],
              next_to_play: data.next_to_play === p.id,
              scores: p.scores || [],
            } as {
              id: number;
              name: string;
              admin?: boolean;
              me?: boolean;
              made_cards: string[];
              cards: [];
              thrown: [];
              next_to_play: boolean;
              scores: {
                value: number;
              }[];
            })
        )
      );
      setRound(data.round);

      if (data?.playing_round) {
        setPlayingRound(data.playing_round);
        // set made_cards and cards on all player state as well
      } else {
        setPlayingRound(null);
      }
    });

    // socket.on(`table_${room_id}_cards`, (data) => {
    //   console.log("tbl_crds", data);
    // });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    if (!playing_round || !players.length) return;

    setPlayers((p) =>
      p.map(
        (pl) =>
          ({
            ...pl,
            made_cards:
              playing_round?.RoundCards.filter((x) => x.player.id === pl.id)[0]
                ?.made_cards || [],
            cards:
              playing_round?.RoundCards.filter((x) => x.player.id === pl.id)[0]
                ?.made_cards || [],
            thrown:
              playing_round?.RoundCards.filter((x) => x.player.id === pl.id)[0]
                ?.thrown || [],
            next_to_play: next_to_play === pl.id || null,
          } as {
            id: number;
            name: string;
            admin?: boolean;
            me?: boolean;
            made_cards: string[];
            cards: [];
            thrown: [];
            next_to_play: boolean;
            scores: {
              value: number;
            }[];
          })
      )
    );

    const my_hand = playing_round?.RoundCards.filter(
      (x) => x.player.id === parseInt(user_id || "0")
    )[0];

    if (my_hand) {
      if (my_hand?.made_cards?.length) {
        setReady(true);
      } else {
        setReady(false);
      }
      setHand(
        playing_round?.status === "PLAYING" || !!my_hand?.made_cards?.length
          ? my_hand?.made_cards
          : my_hand?.cards
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing_round]);

  return (
    <>
      {isConnected ? (
        <main className="bg-[url(/bg-table.jpg)] h-svh w-svw bg-cover p-10 bg-center overflow-hidden">
          <GameHeader name={name} players={players} />
          <Game
            round={round}
            players={players}
            admin={!!players?.filter((p) => p.admin && p.me)?.length}
            hand={hand}
            startGame={startGame}
            commitCards={commitCards}
            ready={ready}
            throwCards={throwCards}
            user_id={user_id}
            playing_round={playing_round}
          />
          <Chats messages={feedback} />
        </main>
      ) : (
        // loading
        <main className="bg-[url(/bg-table.jpg)] h-svh w-svw bg-cover p-10 bg-center">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-10 bg-slate-800/30 text-white rounded-lg">
            <h1 className="text-3xl font-bold">Connecting...</h1>
          </div>
        </main>
      )}
    </>
  );
}
