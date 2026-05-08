import { useMemo, useState } from "react";
import { FiArrowLeft, FiSearch, FiSend } from "react-icons/fi";

type ChatContact = {
  id: number;
  name: string;
  preview: string;
  day: string;
};

type ChatMessage = {
  id: number;
  text: string;
  time: string;
  sender: "umkm" | "talent";
};

const contacts: ChatContact[] = [
  {
    id: 1,
    name: "Kathryn Murphy",
    preview: "Halo Jane, kami sudah meninjau...",
    day: "Senin",
  },
  {
    id: 2,
    name: "Devon Lane",
    preview: "Halo Jane, karir sudah meninjau...",
    day: "Senin",
  },
];

const conversationByContact: Record<number, ChatMessage[]> = {
  1: [
    {
      id: 1,
      sender: "talent",
      text: `Hai Jane!
Terima kasih atas undangan wawancaranya. Saya sangat antusias dan akan hadir pada 19 Maret 2025, pukul 10:00–12:00 WIB melalui Google Meet.

Saya menantikan kesempatan untuk berdiskusi lebih lanjut mengenai posisi dan tim Anda.

Salam,
Kathryn Murphy`,
      time: "12.30",
    },
    {
      id: 2,
      sender: "umkm",
      text: `Hai Kathryn!
Terima kasih sudah melamar di perusahaan kami. Kami senang mengundang Anda untuk interview pada 19 Maret 2025, pukul 10:00–12:00 WIB lewat Google Meet.

Detail jadwal dan link akan segera dikirim. Anda juga bisa cek status di menu Jadwal Wawancara atau lanjut ngobrol lewat chat.

Sampai jumpa di sesi wawancara!`,
      time: "12.40",
    },
  ],
  2: [
    {
      id: 1,
      sender: "talent",
      text: "Halo, saya siap mengikuti proses berikutnya. Terima kasih atas informasinya.",
      time: "11.10",
    },
    {
      id: 2,
      sender: "umkm",
      text: "Baik, nanti kami kirim jadwal detail wawancara lewat chat ini ya.",
      time: "11.15",
    },
  ],
};

function initials(name: string) {
  const words = name.split(" ");
  const first = words[0]?.[0] ?? "U";
  const second = words[1]?.[0] ?? "M";
  return `${first}${second}`.toUpperCase();
}

export default function ChatPage() {
  const [activeContactId, setActiveContactId] = useState<number>(1);
  const [messageValue, setMessageValue] = useState("");

  const activeContact = useMemo(
    () => contacts.find((c) => c.id === activeContactId) ?? contacts[0],
    [activeContactId],
  );

  const messages = conversationByContact[activeContact.id] ?? [];

  return (
    <main className="min-h-dvh w-full bg-[#e9e9e9]">
      <div className="flex min-h-dvh w-full flex-col overflow-hidden bg-white sm:flex-row">
        {/* SIDEBAR */}
        <aside className="w-full shrink-0 bg-[#4f6fa3] text-white sm:w-75 sm:border-r sm:border-black/5">
          <header className="border-b border-white/20 px-4 py-4 sm:px-6 sm:py-5">
            <div className="mb-4 flex items-center gap-3 text-xl font-bold">
              <FiArrowLeft />
              <h1 className="text-xl">CHAT</h1>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-[#6b84ad] px-4 py-2">
              <input
                type="text"
                placeholder="Cari orang..."
                className="w-full bg-transparent text-sm placeholder:text-white/70 focus:outline-none"
              />
              <FiSearch />
            </div>
          </header>

          <div className="max-h-52.5 space-y-2 overflow-y-auto px-2 py-4 sm:max-h-none sm:py-5">
            {contacts.map((contact) => {
              const active = contact.id === activeContactId;
              return (
                <button
                  key={contact.id}
                  type="button"
                  onClick={() => setActiveContactId(contact.id)}
                  className={`flex w-full items-start gap-3 rounded-xl px-4 py-3 text-left transition ${
                    active ? "bg-white/20" : "hover:bg-white/10"
                  }`}
                >
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-[#c8e0e4] text-xs font-bold text-[#2f4d69]">
                    {initials(contact.name)}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>{contact.name}</span>
                      <span className="text-xs text-white/70">
                        {contact.day}
                      </span>
                    </div>
                    <p className="truncate text-xs text-white/70">
                      {contact.preview}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* CHAT AREA */}
        <section className="flex min-h-0 flex-1 flex-col bg-[#f3f3f3]">
          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6">
            <div className="mx-auto w-full max-w-245">
              {messages.map((message) => {
                const fromUmkm = message.sender === "umkm";

                return (
                  <div
                    key={message.id}
                    className={`flex w-full ${
                      fromUmkm
                        ? "mt-4 justify-end"
                        : "mt-6 justify-start sm:mt-8"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-3 text-[13px] shadow-md sm:max-w-105 sm:px-4 sm:text-sm ${
                        fromUmkm
                          ? "bg-white rounded-tr-sm"
                          : "bg-white rounded-tl-sm"
                      }`}
                    >
                      <p className="whitespace-pre-line text-gray-800 leading-relaxed">
                        {message.text}
                      </p>
                      <p className="mt-2 text-right text-xs text-gray-400">
                        {message.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* INPUT */}
          <footer className="px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-2 sm:px-6 sm:pb-5">
            <form
              className="relative"
              onSubmit={(e) => {
                e.preventDefault();
                setMessageValue("");
              }}
            >
              <input
                type="text"
                value={messageValue}
                onChange={(e) => setMessageValue(e.target.value)}
                placeholder="Ketik pesan Anda di sini..."
                className="h-12 w-full rounded-full bg-white px-5 pr-14 text-sm shadow-md focus:outline-none sm:h-14 sm:px-6 sm:pr-16"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                <FiSend className="text-xl sm:text-2xl" />
              </button>
            </form>
          </footer>
        </section>
      </div>
    </main>
  );
}
