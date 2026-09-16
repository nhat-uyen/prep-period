import { useCallback, useReducer } from "react";
import { BrowserRouter, Routes, Route } from "react-router"
import type { Lesson } from "./types/lesson";
import History from "./pages/History";
import GenerateLesson from "./pages/GenerateLesson";
import { historyReducer, initialHistory } from "./reducers/historyReducer";
import Home from "./pages/Home";
import Reflection from "./pages/Reflection";

function App() {
  const [history, dispatch] = useReducer(historyReducer, initialHistory);

  const setHistory = useCallback((lessons: Lesson[]) => {
    dispatch({ type: "SET_HISTORY", lessons })
  }, []);

  function removeLesson(lessonId: number) {
    dispatch({ type: "REMOVE_LESSON", id: lessonId })
  }
  function clearHistory() {
    dispatch({ type: "CLEAR_HISTORY" })
  }

  function addLesson(newLesson: Lesson) {
    dispatch({ type: "ADD_LESSON", lesson: newLesson })
  }
  function editLesson(savedLesson: Lesson) {
    dispatch({ type: "EDIT_LESSON", lesson: savedLesson })
  }


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate" element={<GenerateLesson
          addLesson={addLesson}
          editLesson={editLesson} />} />
        <Route path="/history" element={<History
          history={history}
          setHistory={setHistory}
          removeLesson={removeLesson}
          clearHistory={clearHistory} />}
        />
        <Route path="/reflection" element={<Reflection />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App;