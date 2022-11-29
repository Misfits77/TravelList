import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  query,
  collection,
  getDocs,
  where,
} from "firestorage";
import _ from "underscore";
import { RiCheckboxFill, RiHome2Fill } from "react-icons/ri";

function TravelListItems({ itemIds, handleChecked, checkedCheckboxes }) {
  const q = query(collection("items"), where("id", "in", itemIds));
  const items = getDocs(q).data();
  const groups = _.groupBy(items, "categoryId");
  const entries = Object.entries(groups);

  return (
    <div>
      {entries.map(([categoryId, items]) => {
        const category = getDoc(doc("categories", categoryId)).data();
        return (
          <div key={categoryId}>
            <h3>{category.name}</h3>
            <div>
              {items.map((i) => {
                return (
                  <p key={i.id}>
                    <input
                      type="checkbox"
                      checked={checkedCheckboxes.includes(i.id) ? true : false}
                      onChange={(e) => {
                        handleChecked(i);
                      }}
                    />
                    {i.name}
                  </p>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SeeTravelList() {
  const [travelList, setTravelList] = useState(null);
  const [checkedCheckboxes, setCheckedCheckboxes] = useState([]);
  const params = useParams();

  useEffect(() => {
    const travelListSnapShot = getDoc(doc("travelLists", params.id));
    setTravelList(travelListSnapShot.data());
    setCheckedCheckboxes(travelListSnapShot.data().selectedItems || []);
  }, []);

  if (travelList === null) {
    return <p>Loading...</p>;
  }

  const handleChecked = (i) => {
    if (!checkedCheckboxes.includes(i.id)) {
      setCheckedCheckboxes((checkedCheckbox) => [...checkedCheckbox, i.id]);
    } else {
      setCheckedCheckboxes((checkedCheckbox) =>
        checkedCheckbox.filter((checkbox) => checkbox !== i.id)
      );
    }
    return checkedCheckboxes;
  };

  const save = () => {
    updateDoc(doc("travelLists", params.id), {
      selectedItems: checkedCheckboxes,
    });
  };

  return (
    <>
      <nav className="navbarinCreate">
        <Link to="/">
          <button className="home-button">
            <RiHome2Fill />
          </button>
        </Link>
      </nav>
      <main className="seeContainer">
        <div className="seeBasicInfo">
          <p>Name: {travelList.name}</p>
          <p>Destination: {travelList.destination}</p>
          <p>Date: {travelList.date}</p>
        </div>
        <TravelListItems
          itemIds={travelList.items}
          handleChecked={handleChecked}
          checkedCheckboxes={checkedCheckboxes}
        />
      </main>
      <nav className="navBottominCreate">
        <button className="submitCreate" onClick={save}>
          Save <RiCheckboxFill />
        </button>
      </nav>
    </>
  );
}

export default SeeTravelList;
