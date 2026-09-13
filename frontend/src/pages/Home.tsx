import { Link } from "react-router";
import "./Home.css";

export default function Home() {
  return (
    <main className="home">
      <header className="home__header">
        <p className="home__eyebrow">Prep-Period</p>
        <h1>What would you like to do?</h1>
        <p className="home__intro">Plan, revisit, and improve your lessons in one place.</p>
      </header>

      <nav aria-label="Lesson menu" className="home__menu">
        <Link className="home__link" to="/generate">
          <span className="home__link-number">01</span>
          <span>
            <strong>Generate Lesson</strong>
            <small>Build a fresh lesson plan</small>
          </span>
          <span aria-hidden="true" className="home__arrow">-&gt;</span>
        </Link>
        <Link className="home__link" to="/history">
          <span className="home__link-number">02</span>
          <span>
            <strong>Past Lessons</strong>
            <small>Browse your saved plans</small>
          </span>
          <span aria-hidden="true" className="home__arrow">-&gt;</span>
        </Link>
        <Link className="home__link" to="/reflection">
          <span className="home__link-number">03</span>
          <span>
            <strong>Lesson Reflection</strong>
            <small>Reflect on what worked</small>
          </span>
          <span aria-hidden="true" className="home__arrow">-&gt;</span>
        </Link>
      </nav>
    </main>
  )
}