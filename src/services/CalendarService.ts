/**
 * CalendarService.ts
 * Manages upcoming events, deadlines, workshops, and PASS sessions.
 * 
 * TODO: Replace with Supabase / Firebase calendar integration.
 */

export interface CalendarEvent {
  id: string;
  title: string;
  category: "Deadline" | "Workshop" | "Hackathon" | "Presentation" | "Viva";
  date: string;
  time: string;
  countdown: string;
  location: string;
  registered: boolean;
}

export class CalendarService {
  static async getEvents(): Promise<CalendarEvent[]> {
    return [
      {
        id: "e-1",
        title: "PASS Group Sprint Presentation",
        category: "Presentation",
        date: "Friday, Jul 31",
        time: "4:00 PM - 5:30 PM",
        countdown: "2 Days Left",
        location: "Zoom / Lab 304",
        registered: true,
      },
      {
        id: "e-2",
        title: "QbitX Annual AI Hackathon 2026",
        category: "Hackathon",
        date: "Aug 8 - Aug 10",
        time: "48 Hours Online",
        countdown: "10 Days Left",
        location: "QbitX Virtual Hall",
        registered: true,
      },
      {
        id: "e-3",
        title: "Docker & Kubernetes Install Fest",
        category: "Workshop",
        date: "Saturday, Aug 1",
        time: "2:00 PM",
        countdown: "3 Days Left",
        location: "Discord Voice Channel 1",
        registered: false,
      },
      {
        id: "e-4",
        title: "Mock Technical Viva & System Design",
        category: "Viva",
        date: "Monday, Aug 3",
        time: "10:00 AM",
        countdown: "5 Days Left",
        location: "Senior Mentor Room #4",
        registered: true,
      },
    ];
  }
}
