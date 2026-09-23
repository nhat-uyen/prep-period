import axios from "axios";
import type { Lesson, LessonRequest } from "../types/lesson"
import type { Reflection } from "../types/lesson";
/*
Connect to the backend API using Axios with a base URL of "http://localhost:5173". 
This allows for making HTTP requests to the backend server for lesson-related operations. 
The code also demonstrates how to send a POST request to create a new lesson with specific details such as subject, topic, grade, and duration. 
The response from the server is logged to the console for verification.
*/


// Configure Axios instance with the base URL for the backend API
const api = axios.create({ baseURL: "http://localhost:8000" });
export default api

export async function getLessons(): Promise<Lesson[]> {
  const response = await api.get<Lesson[]>("/lessons/all");
  return response.data
}

export async function getLessonByID(id: number): Promise<Lesson> {
  const response = await api.get<Lesson>(`/lessons/${id}`);
  return response.data
}

export async function deleteLesson(id: number): Promise<void> {
  await api.delete(`/lessons/${id}`);
}

export async function updateLesson(id: number, lesson: Lesson): Promise<Lesson> {
  const response = await api.put<Lesson>(`/lessons/${id}`, lesson);
  return response.data
}

export async function clearLessons() {
  await api.delete("/lessons/clear");
}

export async function createReflection(reflection: Reflection): Promise<Reflection> {
  const response = await api.post<Reflection>("/reflections", reflection);
  return response.data;
}

export async function getReflection(lessonId: number): Promise<Reflection> {
  const response = await api.get<Reflection>(`/reflections/${lessonId}`);
  return response.data;
}

// For streaming respsonse
export async function streamLesson(request: LessonRequest, onChunk: (chunk: string) => void): Promise<Lesson> {
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;

  try {
    const response = await fetch("http://localhost:8000/lessons/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Unable to stream lesson (${response.status}): ${detail || response.statusText}`);
    }

    if (!response.body) {
      throw new Error("Unable to stream lesson: response did not include a body");
    }

    reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      // Keep incomplete line for the next chunk
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const message = JSON.parse(line);

          if (message.type === "chunk") {
            onChunk(message.data);
          }

          if (message.type === "complete") {
            return message.lesson as Lesson;
          }

        } catch (error) {
          throw new Error("Unable to parse the lesson returned by the server", { cause: error });
        }
      }
    }

    throw new Error("Unable to stream lesson: response did not include a complete lesson");
  } catch (error) {
    console.error("Error streaming lesson:", error);
    throw error;
  } finally {
    reader?.releaseLock();
  }
}