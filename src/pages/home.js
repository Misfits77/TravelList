import { Link } from "react-router-dom";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
} from "firestorage";
import { useEffect, useState } from "react";

function Home() {
  const [travelLists, setTravelLists] = useState([]);

  useEffect(() => {
    const travelListSnapShot = getDocs(doc("travelLists"));
    setTravelLists(travelListSnapShot.data());
  }, []);

  const deleteTravelList = (travelList) => {
    if (!window.confirm("Are you sure you want to delete this list?")) {
      return;
    }
    const newArray = travelLists.filter((list) => {
      if (list.id === travelList.id) {
        return false;
      } else {
        return true;
      }
    });
    setTravelLists(newArray);

    deleteDoc(doc("travelLists", travelList.id));
  };

  return (
    <>
      <main>
        {travelLists.map((travelList) => {
          return (
            <div key={travelList.id}>
              <Link to={`/travel-list/${travelList.id}`}>
                <h2>{travelList.name}</h2>
              </Link>
              <Link to={`/travel-list/${travelList.id}/edit`}>
                <button>Edit</button>
              </Link>
              <button
                onClick={(e) => {
                  deleteTravelList(travelList);
                }}
              >
                Delete
              </button>
              <hr />
            </div>
          );
        })}
      </main>
      <nav>
        <Link to="/travel-list/new">
          <button>Create Travel List</button>
        </Link>
      </nav>
    </>
  );
}

export default Home;
