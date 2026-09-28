import React, { useState } from 'react';
import { useAnalysis } from '../../hooks/useAnalysis.js';
import { MessageSquare, Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';

export function FollowUpChat() {
  const {
    conversation,
    isAnsweringFollowUp,
    handleSendFollowUp,
    currentAnalysis
  } = useAnalysis();

  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim() || isAnsweringFollowUp) return;
    handleSendFollowUp(inputVal);
    setInputVal('');
  };

  const handleChipClick = (text) => {
    handleSendFollowUp(text);
  };

  return (
    <div className="border border-slate-800 bg-slate-900/60 rounded-xl overflow-hidden font-sans text-xs flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 border-b border-slate-800 font-mono">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            INTERACTIVE CONVERSATION
          </span>
        </div>
        <span className="text-[10px] text-slate-400">Context Grounded</span>
      </div>

      <div className="p-3.5 space-y-3 max-h-72 overflow-y-auto bg-slate-950/40">
        {conversation.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white ${
                  isUser
                    ? 'bg-blue-600'
                    : 'bg-linear-to-br from-cyan-500 to-blue-600'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 leading-relaxed text-xs ${
                  isUser
                    ? 'bg-blue-600/20 border border-blue-500/40 text-blue-100 rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1 text-[9px] font-mono text-slate-400">
                  <span>{isUser ? 'YOU' : 'SATQUERY AI'}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          );
        })}

        {isAnsweringFollowUp && (
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center text-white shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 flex items-center gap-2 font-mono text-[11px]">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>Querying vision-language representation...</span>
            </div>
          </div>
        )}
      </div>

      {currentAnalysis?.suggestedFollowUps && currentAnalysis.suggestedFollowUps.length > 0 && (
        <div className="p-2 border-t border-slate-800/80 bg-slate-950/60">
          <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Suggested follow-up:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {currentAnalysis.suggestedFollowUps.slice(0, 2).map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(item)}
                disabled={isAnsweringFollowUp}
                className="text-left text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors truncate max-w-full"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-2.5 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask a follow-up query..."
          disabled={isAnsweringFollowUp}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || isAnsweringFollowUp}
          className="p-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-40 transition-colors"
          title="Send follow-up"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}