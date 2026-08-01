/**
 * src/services/mentor/CalendarOfficeHoursService.ts
 * Manages mentor office hours sessions and 1-on-1 tutoring appointments
 */

import { OfficeHourSession } from "@/types/success";
import { AuditLogService } from "./AuditLogService";

export const MOCK_OFFICE_HOURS: OfficeHourSession[] = [
  {
    id: "oh-1",
    title: "1-on-1 PASS Tutoring & Code Review",
    mentorId: "usr-mentor-1",
    mentorName: "Labib Senior Mentor",
    dateTime: "Thursday, Aug 6 @ 4:30 PM",
    durationMinutes: 45,
    location: "Johnson Hall Lab 304 / Google Meet",
    maxStudents: 1,
    bookedStudentsCount: 1,
    status: "upcoming",
  },
  {
    id: "oh-[#2]",
    title: "Capstone Team Architecture Office Hours",
    mentorId: "usr-mentor-1",
    mentorName: "Labib Senior Mentor",
    dateTime: "Friday, Aug 7 @ 2:00 PM",
    durationMinutes: 60,
    location: "QbitX Virtual Studio Room A",
    maxStudents: 6,
    bookedStudentsCount: 4,
    status: "upcoming",
  },
];

let officeHourStore: OfficeHourSession[] = [...MOCK_OFFICE_HOURS];

export class CalendarOfficeHoursService {
  static getSessions(): OfficeHourSession[] {
    return officeHourStore;
  }

  static createSession(title: string, dateTime: string, location: string, maxStudents: number): OfficeHourSession {
    const newSession: OfficeHourSession = {
      id: `oh-${Date.now()}`,
      title,
      mentorId: "usr-mentor-1",
      mentorName: "Labib Senior Mentor",
      dateTime,
      durationMinutes: 60,
      location,
      maxStudents,
      bookedStudentsCount: 0,
      status: "upcoming",
    };

    officeHourStore.unshift(newSession);

    AuditLogService.logAction({
      actorId: "usr-mentor-1",
      actorName: "Labib Senior Mentor",
      actorRole: "mentor",
      actionType: "OFFICE_HOURS_SCHEDULED",
      targetId: newSession.id,
      targetType: "office_hour",
      details: `Scheduled new office hours session: "${title}" on ${dateTime}.`,
    });

    return newSession;
  }
}
