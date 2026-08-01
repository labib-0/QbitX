"use client";

import { Activity, Lesson } from "@/types/content";
import { VideoPlayer } from "./VideoPlayer";
import { ReadingViewer } from "./ReadingViewer";
import { CodingPlayground } from "./CodingPlayground";
import { QuizAssessment } from "./QuizAssessment";
import { AssignmentSubmitter } from "./AssignmentSubmitter";
import { ProjectViewer } from "./ProjectViewer";
import { LiveSessionViewer } from "./LiveSessionViewer";

interface LessonRendererProps {
  lesson: Lesson;
  activity?: Activity;
  courseId: string;
  userId: string;
  onBookmarkTimestamp?: (sec: number) => void;
  onBookmarkSnippet?: (snippet: string) => void;
  onCompleteLesson?: () => void;
}

export function LessonRenderer({
  lesson,
  activity,
  courseId,
  userId,
  onBookmarkTimestamp,
  onBookmarkSnippet,
  onCompleteLesson,
}: LessonRendererProps) {
  const type = activity?.type || "reading";

  switch (type) {
    case "video":
      return (
        <VideoPlayer
          videoUrl={activity?.contentPayload?.videoUrl}
          title={lesson.metadata.title}
          lessonId={lesson.id}
          courseId={courseId}
          userId={userId}
          onBookmarkTimestamp={onBookmarkTimestamp}
          onCompleteLesson={onCompleteLesson}
        />
      );

    case "reading":
    case "interactive_slides":
    case "resource":
      return (
        <ReadingViewer
          title={lesson.metadata.title}
          lessonId={lesson.id}
          courseId={courseId}
          userId={userId}
          onCompleteLesson={onCompleteLesson}
          onBookmarkSnippet={onBookmarkSnippet}
        />
      );

    case "coding_lab":
      return (
        <CodingPlayground
          title={lesson.metadata.title}
          lessonId={lesson.id}
          courseId={courseId}
          userId={userId}
          starterCode={activity?.contentPayload?.starterCode}
          onCompleteLesson={onCompleteLesson}
        />
      );

    case "quiz":
      return (
        <QuizAssessment
          title={lesson.metadata.title}
          lessonId={lesson.id}
          courseId={courseId}
          userId={userId}
          onCompleteLesson={onCompleteLesson}
        />
      );

    case "assignment":
      return (
        <AssignmentSubmitter
          title={lesson.metadata.title}
          lessonId={lesson.id}
          courseId={courseId}
          userId={userId}
          onCompleteLesson={onCompleteLesson}
        />
      );

    case "project":
      return (
        <ProjectViewer
          title={lesson.metadata.title}
          lessonId={lesson.id}
          courseId={courseId}
          userId={userId}
          onCompleteLesson={onCompleteLesson}
        />
      );

    case "live_session":
      return (
        <LiveSessionViewer
          title={lesson.metadata.title}
          startTime={activity?.contentPayload?.liveSessionStartTime}
          streamUrl={activity?.contentPayload?.liveSessionUrl}
        />
      );

    default:
      return (
        <ReadingViewer
          title={lesson.metadata.title}
          lessonId={lesson.id}
          courseId={courseId}
          userId={userId}
          onCompleteLesson={onCompleteLesson}
          onBookmarkSnippet={onBookmarkSnippet}
        />
      );
  }
}
