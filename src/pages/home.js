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
  RiChatSettingsFill,
  RiChatDeleteFill,
  RiChatNewFill,
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
                  Clone
                </button>
                <Link to={`/travel-list/${travelList.id}/edit`}>
                  <button>
                    <RiChatSettingsFill />
                  </button>
                </Link>
                <button
                  onClick={(e) => {
                    deleteTravelList(travelList);
                  }}
                >
                  <RiChatDeleteFill />
                </button>
              </div>
            </div>
          );
        })}
      </main>
      <nav>
        <Link to="/travel-list/new">
          <button>
            New <RiChatNewFill />
          </button>
        </Link>
      </nav>
    </>
  );
}

export default Home;
