import ChatBox from '../components/chatbox';
import ChatSidebar from '../components/chatSidebar';

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <ChatSidebar />
      <ChatBox />
    </div>
  );
}