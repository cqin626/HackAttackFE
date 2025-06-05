import React from "react";
import type { Message } from "../../types/messageType";

interface SenderListProps {
  groupedMessages: Record<string, Message[]>;
  selectedSender: string | null;
  onSelectSender: (email: string) => void;
}

const SenderList: React.FC<SenderListProps> = ({
  groupedMessages,
  selectedSender,
  onSelectSender,
}) => (
  <div className="border-end p-3" style={{ width: "30%", overflowY: "auto" }}>
    {Object.keys(groupedMessages)
      .sort()
      .map((sender) => (
        <div
          key={sender}
          className={`p-2 rounded mb-2 ${selectedSender === sender ? "bg-primary text-white" : "bg-light"}`}
          style={{ cursor: "pointer" }}
          onClick={() => onSelectSender(sender)}
        >
          {sender}
        </div>
      ))}
  </div>
);

export default SenderList;
