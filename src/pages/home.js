import { Link, useNavigate } from "react-router-dom";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  deleteDoc,
  addDoc,
  getDoc,
  updateDoc,
} from "firestorage";
import { useEffect, useState } from "react";
import {
  RiEditBoxFill,
  RiDeleteBin2Fill,
  RiChatNewFill,
  RiFileCopy2Fill,
} from "react-icons/ri";

function Home() {
  const [travelLists, setTravelLists] = useState([]);
  const navigate = useNavigate();

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

  const cloneList = (travelList) => {
    const travelListRef = addDoc(collection("travelLists"), {
      name: "Copy of " + travelList.name,
      destination: travelList.destination,
      date: travelList.date,
      items: travelList.items,
      selectedItems: [],
    });
    navigate(`/travel-list/${travelListRef.id}`);
  };

  return (
    <>
      <nav className="navbar">
        <h1>Travel List</h1>
        <Link to="/travel-list/new">
          <button className="homeNew">
            New <RiChatNewFill />
          </button>
        </Link>
      </nav>
      <main>
        {travelLists.map((travelList) => {
          return (
            <div className="homeLists" key={travelList.id}>
              <Link to={`/travel-list/${travelList.id}`}>
                <h2>{travelList.name}</h2>
              </Link>
              <div className="homeListsButtons">
                <button
                  onClick={(e) => {
                    cloneList(travelList);
                  }}
                >
                  <RiFileCopy2Fill />
                </button>
                <Link to={`/travel-list/${travelList.id}/edit`}>
                  <button>
                    <RiEditBoxFill />
                  </button>
                </Link>
                <button
                  onClick={(e) => {
                    deleteTravelList(travelList);
                  }}
                >
                  <RiDeleteBin2Fill />
                </button>
              </div>
            </div>
          );
        })}
      </main>
    </>
  );
}

export default Home;
