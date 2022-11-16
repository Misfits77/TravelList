import { Routes, Route, Link } from "react-router-dom";

function Home() {
  return (
    <>
      <main></main>
      <nav>
        <Link to="/travel-list/new">
          <button>Create Travel List</button>
        </Link>
      </nav>
    </>
  );
}

export default Home;
