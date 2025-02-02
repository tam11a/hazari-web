interface IChatsProps {
  messages: string[];
}

export default function Chats({ messages }: IChatsProps) {
  return (
    <div className="fixed bottom-5 left-5 z-10 bg-green-900/30 hover:bg-green-950 rounded-md text-white py-3 px-4 w-64 max-w-64 [&:hover>.open-on-hover]:flex overflow-y-auto">
      <div className="space-y-3 mb-6 bg-black/20 p-4 flex-col hidden text-xs rounded-md open-on-hover">
        {messages.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
      <h1 className="text-center text-xs">{messages?.length} Messages</h1>
    </div>
  );
}
