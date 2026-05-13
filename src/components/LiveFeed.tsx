import { useEffect, useRef, useState } from 'react';
import { useAbly } from 'ably/react';
import type * as Ably from 'ably';
import "../styles/ui.css";


interface TaskEvent {
  id: string;
  worker_id: string;
  country: string | null;
  state: 'accepted' | 'resting' | 'completed';
  created_at: string;
}

interface LiveFeedProps {
  apiUrl: string;
  pageSize?: number; // when set, activates mobile mode (top-N + fade)
  className?: string;
}

function formatEventLine(event: TaskEvent): any {
  const location = event.country ? ` in ${event.country}` : '';
  const time = new Date(event.created_at).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const action =
    event.state === 'accepted' ? 'has accepted the task' :
    event.state === 'resting'  ? 'is resting' :
                                 'has completed the task';
  return <p>{`${time}`}<span style={{padding: "0 28px"}}></span> {`A human${location} ${action}.`}</p>;
}

export default function LiveFeed({ apiUrl, pageSize, className }: LiveFeedProps) {
  const isMobile = pageSize !== undefined;
  const limit = pageSize ?? 50;

  const ably = useAbly();
  const [events, setEvents] = useState<TaskEvent[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchEvents = async (before?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(limit) });
      if (before) params.set('before', before);
      const res = await fetch(`${apiUrl}/api/events?${params}`);
      if (!res.ok) return;
      const data: TaskEvent[] = await res.json();
      if (before) {
        setEvents(prev => {
          const ids = new Set(prev.map(e => e.id));
          return [...prev, ...data.filter(e => !ids.has(e.id))];
        });
      } else {
        setEvents(data);
      }
      if (data.length < limit) setHasMore(false);
    } catch {
      // fail silently — feed will populate via real-time
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchEvents();
  }, []);

  // Real-time: prepend incoming task_event messages
  useEffect(() => {
    const channel = ably.channels.get('microrest');
    const handler = (msg: Ably.InboundMessage) => {
      const event = msg.data as TaskEvent;
      if (!event?.id || !event?.state) return;
      setEvents(prev => {
        if (prev.some(e => e.id === event.id)) return prev;
        const next = [event, ...prev];
        return isMobile ? next.slice(0, limit) : next;
      });
    };
    channel.subscribe('task_event', handler);
    return () => { channel.unsubscribe('task_event', handler); };
  }, [ably, isMobile, limit]);

  // Infinite scroll sentinel (desktop only)
  useEffect(() => {
    if (isMobile || !sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          const oldest = events[events.length - 1];
          if (oldest) fetchEvents(oldest.created_at);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [events, hasMore, loading, isMobile]);

  if (isMobile) {
    return (
      <div className={`live-feed live-feed-mobile ${className ?? ''}`}>
        {events.map((event, i) => {
          const opacity = i === events.length - 1 ? 0.15 : i === events.length - 2 ? 0.4 : 1;
          return (
            <p
              key={event.id}
              className="feed-line"
              style={{ opacity, transition: 'opacity 0.4s ease' }}
            >
              {formatEventLine(event)}
            </p>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`live-feed live-feed-desktop ${className ?? ''}`}>
      {events.map(event => (
        <p key={event.id} className="feed-line">
          {formatEventLine(event)}
        </p>
      ))}
      {hasMore && (
        <div ref={sentinelRef} className="feed-sentinel">
          {loading && <span>loading…</span>}
        </div>
      )}
    </div>
  );
}
